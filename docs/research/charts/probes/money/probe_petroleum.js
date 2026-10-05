// probe_petroleum.js
// Compiles refined petroleum imports to DPRK: UNSCR 2397 Cap (500k barrels) vs. Officially Reported vs. Estimated Actual Deliveries.

import fs from 'node:fs';

const petroleumSeries = [
  {
    year: 2018,
    un_cap_barrels: 500000,
    reported_barrels: 41200,
    estimated_actual_barrels_low: 1400000,
    estimated_actual_barrels_high: 1600000,
    sts_events_documented: 148,
    source: "UN Panel of Experts S/2019/171; US submission to 1718 Committee"
  },
  {
    year: 2019,
    un_cap_barrels: 500000,
    reported_barrels: 97400,
    estimated_actual_barrels_low: 3200000,
    estimated_actual_barrels_high: 3890000,
    sts_events_documented: 198,
    source: "UN Panel of Experts S/2020/151; Nampo tanker imagery calculations"
  },
  {
    year: 2020,
    un_cap_barrels: 500000,
    reported_barrels: 45600,
    estimated_actual_barrels_low: 1200000,
    estimated_actual_barrels_high: 1600000,
    sts_events_documented: 121,
    source: "UN Panel of Experts S/2021/211; COVID quarantine measures slowed Nampo discharges"
  },
  {
    year: 2021,
    un_cap_barrels: 500000,
    reported_barrels: 78900,
    estimated_actual_barrels_low: 1500000,
    estimated_actual_barrels_high: 1800000,
    sts_events_documented: 135,
    source: "UN Panel of Experts S/2022/132"
  },
  {
    year: 2022,
    un_cap_barrels: 500000,
    reported_barrels: 95300,
    estimated_actual_barrels_low: 1600000,
    estimated_actual_barrels_high: 2000000,
    sts_events_documented: 142,
    source: "UN Panel of Experts S/2023/171"
  },
  {
    year: 2023,
    un_cap_barrels: 500000,
    reported_barrels: 131200,
    estimated_actual_barrels_low: 1523000,
    estimated_actual_barrels_high: 1800000,
    sts_events_documented: 82, // 82 direct Nampo port discharges
    source: "UN Panel of Experts Final Report S/2024/171"
  },
  {
    year: 2024,
    un_cap_barrels: 500000,
    reported_barrels: 110000,
    estimated_actual_barrels_low: 1800000,
    estimated_actual_barrels_high: 2200000,
    sts_events_documented: 115,
    source: "MSMT Inaugural Report (S/2025/340); White House NSC declassified intelligence"
  },
  {
    year: 2025,
    un_cap_barrels: 500000,
    reported_barrels: 125000,
    estimated_actual_barrels_low: 2200000,
    estimated_actual_barrels_high: 2600000,
    sts_events_documented: 140,
    source: "MSMT/2025/2 Report on Maritime Sanctions Violations"
  },
  {
    year: 2026,
    un_cap_barrels: 500000,
    reported_barrels: 85000, // Jan-Sept
    estimated_actual_barrels_low: 1800000,
    estimated_actual_barrels_high: 2100000, // Jan-Sept projected
    sts_events_documented: 95,
    source: "MSMT/2026/1 Report (released Sept 16, 2026)"
  }
];

const output = {
  description: "DPRK Refined Petroleum Imports: UNSCR 2397 Cap vs. Reported vs. Estimated Deliveries (2018-2026)",
  unit: "Barrels",
  series: petroleumSeries
};

fs.writeFileSync("docs/research/charts/samples/money/petroleum_transfers_yearly.json", JSON.stringify(output, null, 2));
console.log("Saved docs/research/charts/samples/money/petroleum_transfers_yearly.json");
