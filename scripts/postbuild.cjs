const { spawnSync } = require("child_process");

if (process.env.NETLIFY) {
  console.log("Skipping react-snap on Netlify builds.");
  process.exit(0);
}

const result = spawnSync("npx", ["react-snap"], { stdio: "inherit" });

process.exit(result.status ?? 1);