#!/usr/bin/env python3
"""
Probe script: UN World Population Prospects (WPP 2024).
API: https://population.un.org/dataportalapi/api/v1/
Location: 408 (Democratic People's Republic of Korea / PRK)
Indicators to check:
- Total Population (49, 1)
- Life Expectancy at Birth (61, e0)
- Total Fertility Rate (68, TFR)
- Infant Mortality Rate (67, IMR)
- Under-five Mortality Rate (66, U5MR)
- Median Age (65)
- Net Migration (69)
"""
import urllib.request
import urllib.error
import json
import time

INDICATORS = [
    (49, "Total Population (both sexes)", "thousands"),
    (61, "Life Expectancy at Birth (both sexes)", "years"),
    (68, "Total Fertility Rate", "live births per woman"),
    (67, "Infant Mortality Rate", "infant deaths per 1,000 live births"),
    (66, "Under-five Mortality Rate", "deaths under age 5 per 1,000 live births"),
    (65, "Median Age", "years"),
    (69, "Net Migration", "thousands")
]

def probe_wpp(ind_id, ind_name, unit):
    # Location 408 = Democratic People's Republic of Korea
    url = f"https://population.un.org/dataportalapi/api/v1/data/indicators/{ind_id}/locations/408/start/1950/end/2025"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            records = data.get("data", [])
            if not records:
                return {"id": ind_id, "name": ind_name, "has_data": False, "reason": "empty"}
            
            # Filter for median / estimates variant if applicable (variant 4 is Medium / Estimate)
            # Check structure of records
            years = [r.get("timeLabel") or r.get("timeStart") for r in records if r.get("value") is not None]
            years_clean = [int(y) for y in years if str(y).isdigit()]
            
            # Find latest estimate (up to 2024/2025)
            estimates = [r for r in records if r.get("variant") in ("Estimates", "Medium", None, "")]
            if not estimates:
                estimates = records
            
            estimates_sorted = sorted(estimates, key=lambda x: int(x.get("timeLabel") or x.get("timeStart", 0)), reverse=True)
            latest = estimates_sorted[0]
            
            return {
                "id": ind_id,
                "name": ind_name,
                "has_data": True,
                "min_year": min(years_clean) if years_clean else None,
                "max_year": max(years_clean) if years_clean else None,
                "record_count": len(records),
                "latest_year": latest.get("timeLabel") or latest.get("timeStart"),
                "latest_value": f"{latest.get('value')} {unit}".strip(),
                "unit": unit,
                "pull_url": url,
                "sample": latest
            }
    except Exception as e:
        return {"id": ind_id, "name": ind_name, "has_data": False, "error": str(e)}

if __name__ == "__main__":
    print("Probing UN WPP 2024 Data Portal API for DPRK (Location 408)...")
    results = []
    for ind_id, name, unit in INDICATORS:
        res = probe_wpp(ind_id, name, unit)
        results.append(res)
        if res.get("has_data"):
            print(f"[FOUND] WPP {res['id']}: {res['name']} ({res['min_year']}-{res['max_year']}) -> {res['latest_year']}: {res['latest_value']}")
        else:
            print(f"[NO DATA] WPP {ind_id}: {name} ({res.get('reason', res.get('error'))})")
        time.sleep(0.3)
        
    with open("docs/research/charts/samples/global/un_wpp_tested.json", "w") as f:
        json.dump(results, f, indent=2)
