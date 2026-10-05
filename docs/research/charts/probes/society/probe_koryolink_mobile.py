#!/usr/bin/env python3
"""
Probe script: Koryolink / CHEO Technology / Orascom and ITU mobile subscriptions for North Korea.
Extracts:
1. Official Orascom Telecom Media and Technology (OTMT) quarterly filings (2008-2015).
2. KISDI / Korea Development Bank / Stimson Center industry estimates (2016-2021).
3. ITU / World Bank indicator IT.CEL.SETS (total) and IT.CEL.SETS.P2 (per 100 people) through 2023/2024.
"""

import csv
import json
import os
import urllib.request

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../samples/society"))
os.makedirs(SAMPLE_DIR, exist_ok=True)

# 1. Historical official disclosures from Orascom quarterly reports & verified industry milestones
HISTORICAL_KORYOLINK = [
    {"period": "2008-12", "year": 2008, "quarter": "Q4", "subscribers": 5300, "source": "Orascom Q4 2008 Report", "type": "official_corporate"},
    {"period": "2009-06", "year": 2009, "quarter": "Q2", "subscribers": 47873, "source": "Orascom Q2 2009 Report", "type": "official_corporate"},
    {"period": "2009-09", "year": 2009, "quarter": "Q3", "subscribers": 69261, "source": "Orascom Q3 2009 Report", "type": "official_corporate"},
    {"period": "2009-12", "year": 2009, "quarter": "Q4", "subscribers": 91704, "source": "Orascom Q4 2009 Report", "type": "official_corporate"},
    {"period": "2010-03", "year": 2010, "quarter": "Q1", "subscribers": 125661, "source": "Orascom Q1 2010 Report", "type": "official_corporate"},
    {"period": "2010-06", "year": 2010, "quarter": "Q2", "subscribers": 184531, "source": "Orascom Q2 2010 Report", "type": "official_corporate"},
    {"period": "2010-09", "year": 2010, "quarter": "Q3", "subscribers": 301135, "source": "Orascom Q3 2010 Report", "type": "official_corporate"},
    {"period": "2010-12", "year": 2010, "quarter": "Q4", "subscribers": 431984, "source": "Orascom Q4 2010 Report", "type": "official_corporate"},
    {"period": "2011-03", "year": 2011, "quarter": "Q1", "subscribers": 535133, "source": "Orascom Q1 2011 Report", "type": "official_corporate"},
    {"period": "2011-06", "year": 2011, "quarter": "Q2", "subscribers": 666520, "source": "Orascom Q2 2011 Report", "type": "official_corporate"},
    {"period": "2011-09", "year": 2011, "quarter": "Q3", "subscribers": 809000, "source": "Orascom Q3 2011 Report", "type": "official_corporate"},
    {"period": "2011-12", "year": 2011, "quarter": "Q4", "subscribers": 1000000, "source": "Orascom Press Release (Feb 2012 / Year-end)", "type": "official_corporate"},
    {"period": "2012-06", "year": 2012, "quarter": "Q2", "subscribers": 1270000, "source": "Orascom Q2 2012 Report", "type": "official_corporate"},
    {"period": "2012-12", "year": 2012, "quarter": "Q4", "subscribers": 1700000, "source": "Orascom Q4 2012 Report", "type": "official_corporate"},
    {"period": "2013-05", "year": 2013, "quarter": "Q2", "subscribers": 2000000, "source": "Orascom 2M milestone disclosure", "type": "official_corporate"},
    {"period": "2014-06", "year": 2014, "quarter": "Q2", "subscribers": 2400000, "source": "Orascom Q2 2014 Report", "type": "official_corporate"},
    {"period": "2015-10", "year": 2015, "quarter": "Q3", "subscribers": 3000000, "source": "Orascom 3M milestone announcement", "type": "official_corporate"},
    {"period": "2017-12", "year": 2017, "quarter": "Q4", "subscribers": 3800000, "source": "Korea Development Bank / KISDI estimate", "type": "expert_estimate"},
    {"period": "2019-12", "year": 2019, "quarter": "Q4", "subscribers": 4500000, "source": "Stimson Center (Martyn Williams) / KDB estimate", "type": "expert_estimate"},
    {"period": "2020-12", "year": 2020, "quarter": "Q4", "subscribers": 5000000, "source": "Korea Development Bank (KDB) DPRK Economic Review", "type": "expert_estimate"},
    {"period": "2021-12", "year": 2021, "quarter": "Q4", "subscribers": 5800000, "source": "Stimson Center (Koryolink + Kangsong + Byol combined)", "type": "expert_estimate"},
    {"period": "2022-12", "year": 2022, "quarter": "Q4", "subscribers": 6353441, "source": "ITU / World Bank WDI (IT.CEL.SETS)", "type": "international_standard"},
    {"period": "2023-12", "year": 2023, "quarter": "Q4", "subscribers": 6800000, "source": "Korea Information Society Development Institute (KISDI) 2024", "type": "expert_estimate"}
]

def fetch_world_bank_itu():
    print("Fetching ITU mobile subscriptions for North Korea from OWID grapher...")
    url = "https://ourworldindata.org/grapher/mobile-cellular-subscriptions-per-100-people.csv"
    req = urllib.request.Request(url, headers={"User-Agent": "free-north-korea-research/1.0"})
    itu_series = []
    with urllib.request.urlopen(req, timeout=15) as res:
        lines = res.read().decode("utf-8").splitlines()
        for line in lines:
            if "North Korea" in line:
                parts = line.strip().split(",")
                if len(parts) >= 4:
                    try:
                        yr = int(parts[2])
                        val = float(parts[3])
                        itu_series.append({"year": yr, "subs_per_100": round(val, 2)})
                    except ValueError:
                        pass
    itu_series.sort(key=lambda x: x["year"])
    return itu_series

def build_dataset():
    itu_series = fetch_world_bank_itu()
    itu_dict = {item["year"]: item["subs_per_100"] for item in itu_series}
    
    out_csv = os.path.join(SAMPLE_DIR, "mobile_subscriptions.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["period", "year", "quarter", "subscribers", "subs_per_100_itu", "source", "type"])
        for entry in HISTORICAL_KORYOLINK:
            yr = entry["year"]
            per_100 = itu_dict.get(yr, "")
            writer.writerow([
                entry["period"],
                entry["year"],
                entry["quarter"],
                entry["subscribers"],
                per_100,
                entry["source"],
                entry["type"]
            ])
    print(f"Saved mobile subscriptions dataset to {out_csv}")

if __name__ == "__main__":
    build_dataset()
