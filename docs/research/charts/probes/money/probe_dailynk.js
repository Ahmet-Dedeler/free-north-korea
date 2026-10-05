// probe_dailynk.js
// Fetches Daily NK market prices from both the Google Sheet gviz endpoint and WP REST API.

import fs from 'node:fs';

async function main() {
  const sheetId = "1l78JcbokjkdlJ1aSU6F8cuqgC0AbfMkuXOKWiEEbueo";
  const results = {};

  for (const sheet of ["rate", "rice"]) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheet}`;
    const res = await fetch(url);
    const text = await res.text();
    const clean = text.replace(/^[/\*O_o\*\/\s\n]*google\.visualization\.Query\.setResponse\(|\);?\s*$/g, "");
    const d = JSON.parse(clean);
    
    const rows = d.table.rows.map(r => ({
      date: r.c[0]?.f || r.c[0]?.v,
      pyongyang: r.c[1]?.v,
      sinuiju: r.c[2]?.v,
      hyesan: r.c[3]?.v
    })).filter(r => r.date);

    results[sheet] = {
      total_rows: rows.length,
      latest: rows[0],
      earliest: rows[rows.length - 1],
      recent_10: rows.slice(0, 10)
    };
  }

  // Also fetch the latest post from Daily NK English for corn, CNY, gasoline, diesel
  const wpRes = await fetch("https://www.dailynk.com/english/wp-json/wp/v2/posts/325948");
  const post = await wpRes.json();
  results.latest_post = {
    id: post.id,
    date: post.date,
    title: post.title.rendered,
    link: post.link
  };

  fs.writeFileSync("docs/research/charts/samples/money/dailynk_market_sample.json", JSON.stringify(results, null, 2));
  console.log("Successfully wrote docs/research/charts/samples/money/dailynk_market_sample.json");
  console.log("Rate latest:", results.rate.latest);
  console.log("Rice latest:", results.rice.latest);
}

main().catch(console.error);
