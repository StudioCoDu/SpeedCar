const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "www");
const files = ["index.html", "styles.css", "game.js"];

fs.mkdirSync(out, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  const destination = path.join(out, file);
  const contents = fs.readFileSync(source);
  fs.writeFileSync(destination, contents);
}

console.log(`Prepared ${files.length} web files in ${out}`);
