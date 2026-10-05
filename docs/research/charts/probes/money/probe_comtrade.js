// probe_comtrade.js
// Tests UN Comtrade API for China (156) - DPRK (408) trade data.

import fs from 'node:fs';

async function queryComtrade(freq, period, cmdCode = 'TOTAL') {
  // For total trade, cmdCode can be TOTAL or omitted
  const cmdParam = cmdCode === 'TOTAL' ? '&cmdCode=TOTAL' : `&cmdCode=${cmdCode}`;
  const url = `https://comtradeapi.un.org/public/v1/preview/C/${freq}/HS?reporterCode=156&partnerCode=408&period=${period}${cmdParam}`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log(`HTTP ${res.status} for ${period}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(`Error for ${period}:`, e.message);
    return null;
  }
}

async function main() {
  const results = {};
  
  // Test annual periods: 2020 through 2025
  for (const yr of ['2020', '2021', '2022', '2023', '2024']) {
    const data = await queryComtrade('A', yr, 'TOTAL');
    if (data && data.data && data.data.length > 0) {
      results[yr] = data.data.map(d => ({
        flowCode: d.flowCode, // 'M' = import, 'X' = export
        value: d.primaryValue,
        period: d.period
      }));
      console.log(`Year ${yr}: found ${data.data.length} records. Flows:`, results[yr]);
    }
    // Sleep 1s to be polite and avoid 429
    await new Promise(r => setTimeout(r, 1200));
  }

  // Test monthly periods in 2024/2025/2026
  for (const m of ['202412', '202506', '202512', '202601', '202606']) {
    const data = await queryComtrade('M', m, 'TOTAL');
    if (data && data.data && data.data.length > 0) {
      results[m] = data.data.map(d => ({
        flowCode: d.flowCode,
        value: d.primaryValue,
        period: d.period
      }));
      console.log(`Month ${m}: found ${data.data.length} records:`, results[m]);
    } else {
      console.log(`Month ${m}: no data or empty`);
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  fs.writeFileSync("docs/research/charts/samples/money/comtrade_sample.json", JSON.stringify(results, null, 2));
  console.log("Wrote sample to docs/research/charts/samples/money/comtrade_sample.json");
}

main().catch(console.error);
