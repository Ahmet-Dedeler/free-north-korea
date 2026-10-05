// probe_fts.js
// Fetches humanitarian funding flows to DPRK per year from UN OCHA Financial Tracking Service (FTS) API.

import fs from 'node:fs';

async function fetchYear(year) {
  const url = `https://api.hpc.tools/v1/public/fts/flow?countryISO3=PRK&year=${year}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`FTS HTTP ${res.status} for ${year}`);
      return null;
    }
    const data = await res.json();
    const flows = data.data?.flows || [];
    // Only count 'incoming' or positive funding flows
    const incomingFlows = flows.filter(f => f.boundary === 'incoming');
    const totalUSD = incomingFlows.reduce((sum, f) => sum + (f.amountUSD || 0), 0);
    
    // Group donors
    const donors = {};
    for (const f of incomingFlows) {
      // Find donor organization in sourceObjects
      const src = f.sourceObjects?.find(o => o.type === 'Organization');
      const donorName = src?.name || 'Unknown / Unspecified';
      donors[donorName] = (donors[donorName] || 0) + (f.amountUSD || 0);
    }

    return {
      year,
      total_usd: totalUSD,
      flow_count: incomingFlows.length,
      donors
    };
  } catch (e) {
    console.error(`Error for year ${year}:`, e.message);
    return null;
  }
}

async function main() {
  const years = [];
  for (let y = 2010; y <= 2026; y++) {
    years.push(y);
  }

  const results = [];
  for (const y of years) {
    const r = await fetchYear(y);
    if (r) {
      console.log(`${r.year}: $${(r.total_usd / 1_000_000).toFixed(2)}M USD (${r.flow_count} flows)`);
      results.push(r);
    }
    // Polite delay
    await new Promise(res => setTimeout(res, 300));
  }

  const output = {
    description: "UN OCHA Financial Tracking Service (FTS) Humanitarian Aid to DPRK (2010-2026)",
    source_api: "https://api.hpc.tools/v1/public/fts/flow?countryISO3=PRK",
    publisher: "UN OCHA Financial Tracking Service",
    fetched_at: new Date().toISOString(),
    series: results
  };

  fs.writeFileSync("docs/research/charts/samples/money/fts_humanitarian_funding.json", JSON.stringify(output, null, 2));
  console.log("Saved docs/research/charts/samples/money/fts_humanitarian_funding.json");
}

main().catch(console.error);
