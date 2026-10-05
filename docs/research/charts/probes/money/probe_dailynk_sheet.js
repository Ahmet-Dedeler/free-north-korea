// probe_dailynk_sheet.js
async function main() {
  const res = await fetch("https://www.dailynk.com", { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const m = html.match(/SHEET_ID\s*=\s*["'`]([^"'`]+)["'`]/);
  console.log("SHEET_ID match:", m ? m[1] : "none");
  const idx = html.indexOf("loadSheet");
  if (idx !== -1) {
    console.log("Code before loadSheet:\n", html.slice(Math.max(0, idx - 1200), idx));
  }
}
main().catch(console.error);
