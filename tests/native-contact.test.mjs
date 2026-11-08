import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('SSR-visible contact form has a native POST destination rather than leaking fields in a GET URL',()=>{
 const app=readFileSync('src/App.jsx','utf8');const form=app.match(/<form id="lead-form"[^>]+>/)[0];
 assert.match(form,/method="POST"/);assert.match(form,/action=\{`https:\/\/formspree\.io\/f\/\$\{FORMSPREE_FORM_ID\}`\}/);
 assert.match(form,/onSubmit=\{handleFormspreeSubmit\}/);
});
