// probe_nkpro.js
async function main() {
  const res = await fetch("https://www.nknews.org/pro/import-export/", { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  console.log("Looking for paywall / content details:");
  const paywallBlock = html.match(/<div class="[^"]*paywall[^"]*"[\s\S]*?<\/div>/);
  if (paywallBlock) {
    console.log("Paywall block:\n", paywallBlock[0].slice(0, 500));
  } else {
    console.log("No specific paywall class block found");
  }

  // Check how articles report trade: NK News publishes free summaries of monthly GACC trade data!
  const resFree = await fetch("https://www.nknews.org/category/news-analysis/?s=customs", { headers: { "User-Agent": "Mozilla/5.0" } });
  const htmlFree = await resFree.text();
  const titles = [...htmlFree.matchAll(/<h2 class="entry-title"[^>]*><a [^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
  console.log("Free trade article titles:", titles.slice(0, 5));
}
main().catch(console.error);
