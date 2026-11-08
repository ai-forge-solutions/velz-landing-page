import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

// Run the actual analytics module. Only browser APIs are doubled; no analytics
// helper is copied here. esbuild resolves the Vite env expression, not behavior.
const { code } = transformSync(readFileSync(new URL('../src/analytics.js', import.meta.url), 'utf8'), {
  format: 'cjs', define: { 'import.meta.env.VITE_GA_MEASUREMENT_ID': '"G-TEST"' },
});
function browser({ url = 'https://velz.io/', consent = 'granted', session = new Map(), referrer = '', readyState = 'complete', blockedStorage = false } = {}) {
  const ids = new Map(), listeners = new Map(), storageCalls = [], cookies = [], scripts = [];
  class Element {
    constructor(tag = 'div', attrs = {}, parent = null) {
      this.tagName = tag.toUpperCase(); this.attrs = attrs; this.parentElement = parent;
      this.dataset = {}; this.textContent = 'Contactar'; this.events = new Map();
      this.id = attrs.id || '';
    }
    getAttribute(name) { return this.attrs[name] ?? null; }
    setAttribute(name, value) { this.attrs[name] = value; }
    closest(selector) {
      const matches = selector.split(',').some(s => {
        s = s.trim();
        if (s === 'a[href]') return this.tagName === 'A' && 'href' in this.attrs;
        if (s === '[id]') return !!this.id;
        if (s === '[data-consent]') return !!this.dataset.consent;
        if (s === '[data-cookie-settings]') return 'data-cookie-settings' in this.attrs;
        if (s === '#lead-form') return this.id === 'lead-form';
        if (s === 'form') return this.tagName === 'FORM';
        return s.toUpperCase() === this.tagName;
      });
      return matches ? this : this.parentElement?.closest(selector) || null;
    }
    addEventListener(name, fn) { this.events.set(name, fn); }
    remove() { ids.delete(this.id); }
  }
  const append = el => { if (el.id) ids.set(el.id, el); if (el.tagName === 'SCRIPT') scripts.push(el); };
  const document = {
    readyState, referrer, head: { appendChild: append }, body: { appendChild: append },
    createElement: tag => new Element(tag), getElementById: id => ids.get(id), querySelector: () => null,
    addEventListener(name, fn) { const list = listeners.get(name) || []; list.push(fn); listeners.set(name, list); },
  };
  Object.defineProperty(document, 'cookie', { get() { cookies.push('read'); return '_ga=old; _ga_TEST=old; essential=ok'; }, set(value) { cookies.push(value); } });
  const local = new Map(consent ? [['velz_consent_v1', consent]] : []);
  const window = {
    location: new URL(url), innerHeight: 800,
    localStorage: { getItem: k => local.get(k), setItem: (k,v) => local.set(k,v) },
    sessionStorage: Object.fromEntries(['getItem', 'setItem', 'removeItem'].map(method => [method, (key, value) => {
      storageCalls.push([method, key, value]); if (blockedStorage) throw Error('blocked');
      if (method === 'getItem') return session.get(key) ?? null;
      if (method === 'setItem') session.set(key, value); else session.delete(key);
    }])),
    addEventListener(name, fn) { const list = listeners.get(name) || []; list.push(fn); listeners.set(name, list); }, removeEventListener() {}, requestAnimationFrame: fn => fn(),
  };
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, window, document, Element, URL, URLSearchParams,
    navigator: { userAgent: 'node-test' }, require() { throw Error('unexpected dependency'); },
  }, { importModuleDynamically: () => Promise.reject(Error('web-vitals unavailable in minimal DOM')) });
  const dispatch = (name, target, extra = {}) => {
    const event = { target, button: 0, preventDefault() {}, ...extra };
    for (const fn of listeners.get(name) || []) fn(event);
  };
  const choose = value => {
    dispatch('click', new Element('button', { 'data-cookie-settings': '' }));
    const button = new Element('button'); button.dataset.consent = value;
    ids.get('velz-consent').events.get('click')({ target: button });
  };
  const events = name => Array.from(window.dataLayer || []).filter(row => row[0] === 'event' && (!name || row[1] === name)).map(row => ({ name: row[1], ...row[2] }));
  return { window, document, Element, dispatch, choose, events, track: module.exports.track, session, storageCalls, cookies, scripts, listeners };
}

test('canonical guide index and slash alias attribute service interest to guide', () => {
  for (const path of ['/guias','/guias/']) {
    const x=browser({url:`https://velz.io${path}`});x.dispatch('click',new x.Element('a',{href:'/servicios/momentum'}));
    assert.equal(x.events('service_click')[0].source_type,'guide');
  }
});

test('guide → service → contact keeps only bucketed attribution and never submits a lead', () => {
  const guide = browser({ url: 'https://velz.io/guias/marketing?email=private', referrer: 'https://search.example/' });
  const link = new guide.Element('a', { href: '/servicios/marketing-mix-modeling' });
  guide.dispatch('click', new guide.Element('span', {}, link));
  assert.deepEqual(guide.events('service_click').map(e => [e.service, e.source_type]), [['mmm', 'guide']]);
  assert.deepEqual([...guide.session.values()].map(JSON.parse), [{ service: 'mmm', source_type: 'guide' }]);
  const service = browser({ url: 'https://velz.io/servicios/marketing-mix-modeling', session: guide.session,
    referrer: 'https://velz.io/guias/marketing?token=secret' });
  assert.deepEqual(service.events('service_view').map(e => [e.service, e.source_type, e.content_group]), [['mmm', 'guide', 'service']]);
  service.dispatch('click', new service.Element('a', { href: '/?servicio=mmm#cta' }));
  assert.equal(service.events('service_click')[0].service, 'mmm');
  assert.equal(service.events('cta_click').length, 1, 'new service CTA also retains the existing CTA event');
  const landing = browser({ url: 'https://velz.io/?servicio=mmm&email=secret#cta', session: service.session });
  const form = new landing.Element('form', { id: 'lead-form' });
  const input = new landing.Element('input', {}, form);
  Object.defineProperty(input, 'value', { get() { throw Error('must never read a form value'); } });
  landing.dispatch('focusin', input);
  landing.dispatch('focusin', input);
  landing.dispatch('submit', form);
  assert.equal(landing.events('contact_form_start').length, 1);
  assert.equal(landing.events('generate_lead').length, 0, 'DOM submit is NOT success');
  landing.track('generate_lead', { form_id: 'lead-form', cta_location: 'cta' });
  assert.deepEqual(landing.events('generate_lead').map(e => [e.service, e.source_type, e.form_id]), [['mmm', 'guide', 'lead-form']]);
  assert.doesNotMatch(JSON.stringify([...landing.session]), /secret|email|token|marketing/);
});

test('URL metadata strips arbitrary queries, fragments and diagnostic tokens', () => {
  for (const url of ['https://velz.io/?servicio=momentum&email=secret#private', 'https://velz.io/tools/check/secret?token=secret']) {
    const b = browser({ url, referrer: 'https://external.example/path?email=secret#private' });
    const config = Array.from(b.window.dataLayer).find(row => row[0] === 'config')[2];
    assert.doesNotMatch(JSON.stringify(config), /secret|email|private|token=/);
    assert.equal(config.page_referrer, 'https://external.example/path');
    if (url.includes('/tools/')) assert.equal(config.page_location, 'https://velz.io/tools/check/[token]');
  }
});

test('invalid and foreign service links cannot create attribution; existing events keep destinations', () => {
  const b = browser();
  for (const href of ['https://evil.example/servicios/momentum', '/servicios/unknown', '/?servicio=secret#cta', '/?servicio=mmm&servicio=momentum#cta']) {
    b.dispatch('click', new b.Element('a', { href }));
  }
  assert.equal(b.events('service_click').length, 0);
  b.dispatch('click', new b.Element('a', { href: '#cta' }));
  b.dispatch('click', new b.Element('a', { href: '/#cta' }));
  b.dispatch('click', new b.Element('a', { href: 'mailto:miguel@example.com' }));
  assert.equal(b.events('cta_click').length, 2);
  assert.equal(b.events('contact_email_click').length, 1);
  assert.doesNotMatch(JSON.stringify(b.events()), /miguel@example/);
});

for (const service of ['mmm', 'momentum']) {
  test(`direct landing allowlists ${service}; denied interactions are not replayed`, () => {
    const b = browser({ url: `https://velz.io/?servicio=${service}&token=secret#cta`, consent: 'denied' });
    const form = new b.Element('form', { id: 'lead-form' });
    const input = new b.Element('textarea', {}, form);
    b.dispatch('focusin', input);
    b.dispatch('click', new b.Element('a', { href: '/servicios/momentum' }));
    assert.equal(b.storageCalls.length, 0);
    b.choose('granted');
    assert.equal(b.events('contact_form_start').length, 0);
    b.dispatch('input', input);
    assert.deepEqual(b.events('contact_form_start').map(e => [e.service, e.source_type]), [[service, 'landing']]);
    b.choose('denied');
    const count = b.events().length;
    b.dispatch('focusin', input);
    b.dispatch('click', new b.Element('a', { href: '/servicios/momentum' }));
    assert.equal(b.events().length, count);
    assert.equal(b.session.size, 0);
  });
}

test('late DOM, nested clicks, blocked storage and missing attribution remain safe', () => {
  const b = browser({ readyState: 'loading', blockedStorage: true, url: 'https://velz.io/servicios/momentum/' });
  assert.equal(b.scripts.length, 0);
  b.dispatch('DOMContentLoaded');
  assert.equal(b.events('service_view')[0].service, 'momentum');
  b.dispatch('click', null);
  const link = new b.Element('a', { href: '/?servicio=momentum#cta' });
  b.dispatch('click', new b.Element('svg', {}, link));
  assert.equal(b.events('service_click').length, 1);
  const other = new b.Element('form', { id: 'unrelated' });
  b.dispatch('focusin', new b.Element('input', {}, other));
  assert.equal(b.events('contact_form_start').length, 0);
  b.choose('denied');
  b.choose('granted');
  assert.equal(b.events('service_view').length, 1);
  const landing = browser({ session: new Map([['velz_service_funnel_v1', '{broken']]) });
  landing.track('generate_lead', { form_id: 'lead-form' });
  assert.equal(landing.events('generate_lead')[0].service, undefined);
});

test('stored attribution is reconstructed, not spread into events', () => {
  const session = new Map([['velz_service_funnel_v1', JSON.stringify({ service: 'momentum', source_type: 'guide', email: 'secret', token: 'secret' })]]);
  const b = browser({ session });
  b.track('generate_lead');
  assert.equal(b.events('generate_lead')[0].service, 'momentum');
  assert.doesNotMatch(JSON.stringify(b.events()), /secret|email|token/);
});

test('withdrawal in another tab stops this document without replaying consent', () => {
  const b = browser({ url: 'https://velz.io/servicios/momentum' });
  const count = b.events().length;
  b.dispatch('storage', null, { key: 'velz_consent_v1', newValue: 'denied' });
  b.track('generate_lead');
  assert.equal(b.events().length, count);
  assert.equal(b.session.size, 0);
  assert.equal(b.window['ga-disable-G-TEST'], true);
});

test('direct service views use the service source bucket and safe consent defaults', () => {
  const b = browser({ url: 'https://velz.io/servicios/momentum' });
  assert.deepEqual(b.events('service_view').map(e => [e.service, e.source_type]), [['momentum', 'service']]);
  const rows = Array.from(b.window.dataLayer);
  assert.equal(rows[0][0], 'consent');
  assert.equal(rows[0][1], 'default');
  assert.equal(rows[0][2].analytics_storage, 'denied');
  assert.equal(rows[0][2].ad_storage, 'denied');
  assert.equal(rows[0][2].ad_user_data, 'denied');
  assert.equal(rows[0][2].ad_personalization, 'denied');
  const ai = browser({ url: 'https://velz.io/?utm_source=chatgpt' });
  assert.equal(ai.events('ai_referral')[0].ai_source, 'chatgpt');
  assert.equal(ai.session.get('velz_ai_referral_sent'), '1');
});

test('public track cannot inject non-allowlisted attribution', () => {
  const b = browser();
  b.track('generate_lead', { form_id: 'lead-form', service: 'secret@example.com', source_type: 'token' });
  const lead = b.events('generate_lead')[0];
  assert.equal(lead.service, undefined);
  assert.equal(lead.source_type, undefined);
  assert.equal(lead.form_id, 'lead-form');
});

test('consent gates all funnel work and withdrawal stops public track immediately', () => {
  const b = browser({ url: 'https://velz.io/servicios/momentum', consent: null });
  assert.equal(b.storageCalls.length, 0);
  assert.equal(b.cookies.length, 0);
  assert.equal(b.scripts.length, 0);
  assert.equal(b.events().length, 0);
  b.choose('granted');
  b.track('generate_lead', { form_id: 'lead-form' });
  b.choose('denied');
  const count = b.events().length;
  b.track('generate_lead');
  assert.equal(b.events().length, count, 'track must not enqueue events after withdrawal');
  assert.equal(b.window['ga-disable-G-TEST'], true);
  assert.ok(b.cookies.some(value => value.includes('_ga=; Max-Age=0')));
  assert.ok(!b.cookies.some(value => value.startsWith('essential=')));
  assert.equal(b.session.size, 0);
  b.choose('granted');
  assert.equal(b.window['ga-disable-G-TEST'], false);
  assert.equal(b.scripts.length, 1, 'reaccept must not inject another script');
});
