#!/usr/bin/env python3
"""
Probe script: Test World Bank WDI indicators for DPRK (country code PRK).
Uses https://api.worldbank.org/v2/country/PRK/indicator/<IND>?format=json&per_page=100
"""
import urllib.request
import json
import time

INDICATORS = [
    # Demographics & Health
    ("SP.POP.TOTL", "Total Population"),
    ("SP.DYN.LE00.IN", "Life Expectancy at Birth (years)"),
    ("SP.DYN.TFRT.IN", "Fertility Rate, Total (births per woman)"),
    ("SP.DYN.CBRT.IN", "Birth Rate, Crude (per 1,000)"),
    ("SP.DYN.CDRT.IN", "Death Rate, Crude (per 1,000)"),
    ("SP.DYN.IMRT.IN", "Mortality Rate, Infant (per 1,000 live births)"),
    ("SH.DYN.MORT", "Mortality Rate, Under-5 (per 1,000 live births)"),
    ("SH.STA.MMRT", "Maternal Mortality Ratio (per 100,000 live births)"),
    ("SH.TBS.INCD", "Incidence of Tuberculosis (per 100,000 people)"),
    ("SH.IMM.IDPT", "Immunization, DPT (% of children ages 12-23 months)"),
    ("SH.IMM.MEAS", "Immunization, Measles (% of children ages 12-23 months)"),
    ("SH.STA.STNT.ZS", "Prevalence of Stunting, height for age (% under 5)"),
    ("SH.STA.WAST.ZS", "Prevalence of Wasting, weight for height (% under 5)"),
    ("SN.ITK.DEFC.ZS", "Prevalence of Undernourishment (% of population)"),
    
    # Infrastructure, Energy & Environment
    ("EG.ELC.ACCS.ZS", "Access to Electricity (% of population)"),
    ("EG.ELC.ACCS.RU.ZS", "Access to Electricity, Rural (% of rural population)"),
    ("EG.ELC.ACCS.UR.ZS", "Access to Electricity, Urban (% of urban population)"),
    ("EN.ATM.CO2E.PC", "CO2 Emissions (metric tons per capita)"),
    ("EN.ATM.CO2E.KT", "CO2 Emissions (kt)"),
    ("AG.LND.FRST.ZS", "Forest Area (% of land area)"),
    ("AG.LND.ARBL.ZS", "Arable Land (% of land area)"),
    ("AG.YLD.CREL.KG", "Cereal Yield (kg per hectare)"),
    ("AG.PRD.CREL.MT", "Cereal Production (metric tons)"),
    
    # Technology
    ("IT.CEL.SETS.P2", "Mobile Cellular Subscriptions (per 100 people)"),
    ("IT.CEL.SETS", "Mobile Cellular Subscriptions (total)"),
    ("IT.NET.USER.ZS", "Individuals Using the Internet (% of population)"),
    ("IT.MLT.MAIN.P2", "Fixed Telephone Subscriptions (per 100 people)"),
    
    # Economy (Check if null)
    ("NY.GDP.MKTP.CD", "GDP (current US$)"),
    ("NY.GDP.PCAP.CD", "GDP per capita (current US$)"),
    ("NE.EXP.GNFS.CD", "Exports of Goods and Services (current US$)"),
    ("DT.ODA.ALLD.CD", "Net Official Development Assistance Received (current US$)"),
    
    # Education & Labor
    ("SE.PRM.ENRR", "School Enrollment, Primary (% gross)"),
    ("SE.ADT.LITR.ZS", "Literacy Rate, Adult Total (% ages 15+)"),
    ("SL.TLF.TOTL.IN", "Labor Force, Total"),
    ("SL.UEM.TOTL.ZS", "Unemployment, Total (% of labor force)")
]

def check_indicator(ind, name):
    url = f"https://api.worldbank.org/v2/country/PRK/indicator/{ind}?format=json&per_page=100"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if len(data) < 2 or not data[1]:
                return {"ind": ind, "name": name, "has_data": False, "reason": "empty"}
            
            records = [r for r in data[1] if r.get("value") is not None]
            if not records:
                return {"ind": ind, "name": name, "has_data": False, "reason": "all null"}
            
            years = [int(r["date"]) for r in records]
            records_sorted = sorted(records, key=lambda x: int(x["date"]), reverse=True)
            latest = records_sorted[0]
            
            return {
                "ind": ind,
                "name": name,
                "has_data": True,
                "min_year": min(years),
                "max_year": max(years),
                "record_count": len(records),
                "latest_year": latest["date"],
                "latest_value": latest["value"],
                "pull_url": url
            }
    except Exception as e:
        return {"ind": ind, "name": name, "has_data": False, "error": str(e)}

if __name__ == "__main__":
    print(f"Testing {len(INDICATORS)} WDI indicators...")
    has_data = []
    no_data = []
    for ind, name in INDICATORS:
        res = check_indicator(ind, name)
        if res.get("has_data"):
            print(f"[FOUND] {ind}: {name} ({res['min_year']}-{res['max_year']}) -> {res['latest_year']}: {res['latest_value']}")
            has_data.append(res)
        else:
            print(f"[NO DATA] {ind}: {name} ({res.get('reason', res.get('error'))})")
            no_data.append(res)
        time.sleep(0.1)

    with open("docs/research/charts/samples/global/wdi_results.json", "w") as f:
        json.dump({"has_data": has_data, "no_data": no_data}, f, indent=2)
    print(f"\nDone: {len(has_data)} with data, {len(no_data)} with no data.")
