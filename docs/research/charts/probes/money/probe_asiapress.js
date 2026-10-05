// probe_asiapress.js
// Scrapes the full price table from Asia Press (Rimjin-gang) Korean and Japanese pages.

import fs from 'node:fs';

async function main() {
  const urlKo = "https://www.asiapress.org/korean/nk-korea-prices/";
  const resKo = await fetch(urlKo, { headers: { "User-Agent": "Mozilla/5.0" } });
  const htmlKo = await resKo.text();

  const tableMatch = htmlKo.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) throw new Error("Table not found in Asia Press Korean page");

  const rows = [...tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  console.log("Total Asia Press rows found:", rows.length);

  const parsed = [];
  // Skip header (row 0)
  for (let i = 1; i < rows.length; i++) {
    const cells = [...rows[i][1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => 
      c[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    );
    if (cells.length >= 7) {
      parsed.push({
        date: cells[0],
        gasoline_kpw: cells[1],
        diesel_kpw: cells[2],
        rice_kpw: cells[3],
        corn_kpw: cells[4],
        cny_kpw: cells[5],
        usd_kpw: cells[6]
      });
    }
  }

  const sample = {
    source_url_ko: urlKo,
    source_url_ja: "https://www.asiapress.org/apn/north-korea_prices/",
    total_observations: parsed.length,
    date_range: {
      earliest: parsed[parsed.length - 1].date,
      latest: parsed[0].date
    },
    latest_record: parsed[0],
    recent_10: parsed.slice(0, 10),
    sample_earliest: parsed.slice(-3)
  };

  fs.writeFileSync("docs/research/charts/samples/money/asiapress_sample.json", JSON.stringify(sample, null, 2));
  console.log("Saved docs/research/charts/samples/money/asiapress_sample.json");
  console.log("Latest survey:", sample.latest_record);
}

main().catch(console.error);
