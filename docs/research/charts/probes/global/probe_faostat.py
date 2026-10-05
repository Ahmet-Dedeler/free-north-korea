#!/usr/bin/env python3
"""
Probe script: FAOSTAT API for DPRK (Area 116: Democratic People's Republic of Korea).
Endpoints: https://fenixservices.fao.org/faostat/api/v1/en/data/<DomainCode>?area=116&...
Domains:
- QCL: Crops and livestock products (Cereals, Rice, Maize, Potatoes)
- FBS: Food Balances (kcal/capita/day, protein, fat)
- FS: Suite of Food Security Indicators (Prevalence of undernourishment)
"""
import urllib.request
import urllib.parse
import json
import time

DOMAINS = [
    # Food Security: Prevalence of undernourishment (PoU)
    {
        "domain": "FS",
        "name": "Suite of Food Security Indicators",
        "params": {
            "area": "116",
            "element": "6121", # Value
            "item": "210011",  # Prevalence of undernourishment (%) (3-year average)
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Crops: Production of Cereals
    {
        "domain": "QCL",
        "name": "Cereal production (Rice, Maize, Wheat, Potatoes)",
        "params": {
            "area": "116",
            "element": "5510", # Production (t)
            "item": "1717",    # Cereals, primary
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Crops: Rice paddy production
    {
        "domain": "QCL",
        "name": "Rice production",
        "params": {
            "area": "116",
            "element": "5510", # Production (t)
            "item": "27",      # Rice
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Crops: Maize production
    {
        "domain": "QCL",
        "name": "Maize (corn) production",
        "params": {
            "area": "116",
            "element": "5510",
            "item": "56",      # Maize
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Crops: Potatoes production
    {
        "domain": "QCL",
        "name": "Potatoes production",
        "params": {
            "area": "116",
            "element": "5510",
            "item": "116",     # Potatoes
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Food Balances: Caloric supply (kcal/capita/day)
    {
        "domain": "FBS",
        "name": "Dietary energy supply (kcal/capita/day)",
        "params": {
            "area": "116",
            "element": "664",  # Food supply (kcal/capita/day)
            "item": "2901",    # Grand Total
            "show_codes": "true",
            "show_unit": "true"
        }
    },
    # Food Balances: Protein supply
    {
        "domain": "FBS",
        "name": "Protein supply quantity (g/capita/day)",
        "params": {
            "area": "116",
            "element": "674",  # Protein supply quantity (g/capita/day)
            "item": "2901",    # Grand Total
            "show_codes": "true",
            "show_unit": "true"
        }
    }
]

def probe_faostat(entry):
    domain = entry["domain"]
    query = urllib.parse.urlencode(entry["params"])
    url = f"https://fenixservices.fao.org/faostat/api/v1/en/data/{domain}?{query}"
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            records = data.get("data", [])
            if not records:
                return {"domain": domain, "name": entry["name"], "has_data": False, "reason": "empty data array"}
            
            # Extract years and values
            valid_recs = [r for r in records if r.get("Value") is not None]
            if not valid_recs:
                return {"domain": domain, "name": entry["name"], "has_data": False, "reason": "all values null"}
            
            # Year field may be "Year" or "Year Code"
            years = []
            for r in valid_recs:
                y = r.get("Year") or r.get("Year Code")
                if y:
                    years.append(str(y))
            
            latest_rec = valid_recs[-1]
            unit = latest_rec.get("Unit", "")
            
            return {
                "domain": domain,
                "name": entry["name"],
                "has_data": True,
                "min_year": years[0] if years else None,
                "max_year": years[-1] if years else None,
                "record_count": len(valid_recs),
                "latest_year": latest_rec.get("Year"),
                "latest_value": f"{latest_rec.get('Value')} {unit}".strip(),
                "unit": unit,
                "pull_url": url,
                "sample": latest_rec
            }
    except Exception as e:
        return {"domain": domain, "name": entry["name"], "has_data": False, "error": str(e)}

if __name__ == "__main__":
    print("Probing FAOSTAT for DPRK (Area 116)...")
    results = []
    for entry in DOMAINS:
        res = probe_faostat(entry)
        results.append(res)
        if res.get("has_data"):
            print(f"[FOUND] {res['domain']} - {res['name']} ({res['min_year']}-{res['max_year']}) -> {res['latest_year']}: {res['latest_value']}")
        else:
            print(f"[NO DATA] {entry['domain']} - {entry['name']}: {res.get('reason', res.get('error'))}")
        time.sleep(0.2)
        
    with open("docs/research/charts/samples/global/faostat_tested.json", "w") as f:
        json.dump(results, f, indent=2)
