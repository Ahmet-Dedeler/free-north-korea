#!/usr/bin/env python3
"""
Probe script: WHO Global Health Observatory (GHO) OData API for North Korea (PRK).
Endpoint: https://ghoapi.azureedge.net/api/<IndicatorCode>?$filter=SpatialDim eq 'PRK'
"""
import urllib.request
import urllib.parse
import json
import time

INDICATORS = [
    # Tuberculosis
    ("MDG_0000000020", "Incidence of tuberculosis (per 100 000 population per year)"),
    ("TB_e_inc_100k", "Incidence of tuberculosis (per 100 000 population)"),
    ("TB_e_inc_num", "Estimated number of incident TB cases"),
    ("TB_e_mort_exc_tbhiv_100k", "Estimated mortality of TB cases (all forms, excluding HIV) per 100 000 population"),
    ("TB_e_mort_exc_tbhiv_num", "Estimated number of deaths from TB (all forms, excluding HIV)"),
    ("TB_rep_tot", "Total number of tuberculosis cases notified"),
    
    # Immunization WUENIC
    ("WHS4_100", "Diphtheria tetanus toxoid and pertussis (DTP3) immunization coverage among 1-year-olds (%)"),
    ("WHS4_117", "Measles-containing-vaccine first-dose (MCV1) immunization coverage among 1-year-olds (%)"),
    ("WHS4_128", "Measles-containing-vaccine second-dose (MCV2) immunization coverage by the nationally recommended age (%)"),
    ("WHS4_129", "Hepatitis B (HepB3) immunization coverage among 1-year-olds (%)"),
    ("WHS4_543", "BCG immunization coverage among 1-year-olds (%)"),
    ("WHS4_122", "Polio (Pol3) immunization coverage among 1-year-olds (%)"),
    
    # Maternal & Child Health
    ("MDG_0000000026", "Maternal mortality ratio (per 100 000 live births)"),
    ("WHOSIS_000003", "Maternal mortality ratio (per 100 000 live births)"),
    ("WHOSIS_000001", "Life expectancy at birth (years)"),
    ("WHOSIS_000002", "Healthy life expectancy (HALE) at birth (years)"),
    ("WHOSIS_000006", "Under-five mortality rate (probability of dying by age 5 per 1000 live births)"),
    ("WHOSIS_000007", "Infant mortality rate (probability of dying between birth and age 1 per 1000 live births)"),
    
    # Non-communicable & Risk factors
    ("NCD_BMI_30A", "Prevalence of obesity among adults, BMI >= 30 (age-standardized estimate) (%)"),
    ("SA_0000001688", "Alcohol, recorded per capita (15+) consumption (in litres of pure alcohol)")
]

def check_indicator(ind_code, ind_name):
    # OData filter syntax
    filter_q = urllib.parse.quote("SpatialDim eq 'PRK'")
    url = f"https://ghoapi.azureedge.net/api/{ind_code}?$filter={filter_q}"
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            records = data.get("value", [])
            if not records:
                return {"code": ind_code, "name": ind_name, "has_data": False, "count": 0}
            
            years = [int(r["TimeDim"]) for r in records if "TimeDim" in r and str(r["TimeDim"]).isdigit()]
            if not years:
                return {"code": ind_code, "name": ind_name, "has_data": False, "reason": "no valid years"}
            
            # Sort by year
            records_with_val = [r for r in records if r.get("NumericValue") is not None or r.get("Value") is not None]
            if not records_with_val:
                return {"code": ind_code, "name": ind_name, "has_data": False, "reason": "values are null"}
            
            records_with_val.sort(key=lambda x: int(x.get("TimeDim", 0)), reverse=True)
            latest = records_with_val[0]
            latest_val = latest.get("NumericValue", latest.get("Value"))
            
            return {
                "code": ind_code,
                "name": ind_name,
                "has_data": True,
                "min_year": min(years),
                "max_year": max(years),
                "count": len(records),
                "latest_year": latest.get("TimeDim"),
                "latest_value": latest_val,
                "pull_url": url,
                "sample": latest
            }
    except Exception as e:
        return {"code": ind_code, "name": ind_name, "has_data": False, "error": str(e)}

if __name__ == "__main__":
    print(f"Probing {len(INDICATORS)} WHO GHO indicators for PRK...")
    results = []
    for code, name in INDICATORS:
        res = check_indicator(code, name)
        results.append(res)
        if res.get("has_data"):
            print(f"[FOUND] {code}: {name} ({res['min_year']}-{res['max_year']}) -> {res['latest_year']}: {res['latest_value']}")
        else:
            print(f"[NO DATA] {code}: {name} ({res.get('error', 'empty')})")
        time.sleep(0.1)
        
    with open("docs/research/charts/samples/global/who_gho_tested.json", "w") as f:
        json.dump(results, f, indent=2)
