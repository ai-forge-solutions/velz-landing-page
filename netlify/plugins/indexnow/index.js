// Notifies IndexNow (Bing, Yandex, Seznam, Naver…) of every sitemap URL after a
// production deploy. Best effort: a failed ping never fails the deploy.
import { readFileSync } from "node:fs";
import path from "node:path";

const HOST = "velz.io";
const KEY = "52967daaed1de66ed5a5a6aa9c379ceb";

export const onSuccess = async ({ constants }) => {
  if (process.env.CONTEXT !== "production") {
    console.log(`IndexNow: skipped for ${process.env.CONTEXT} context.`);
    return;
  }

  try {
    const sitemap = readFileSync(path.join(constants.PUBLISH_DIR, "sitemap.xml"), "utf8");
    const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${response.status}.`);
  } catch (error) {
    console.log(`IndexNow: ping failed (${error.message}).`);
  }
};
