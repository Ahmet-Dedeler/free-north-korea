#!/usr/bin/env python3
"""
Probe script: DPRK Supreme People's Assembly (SPA) and Local Elections Turnout & Vote Share (1948-2023).
Sources:
- Dieter Nohlen, Florian Grotz & Christof Hartmann (2001) Elections in Asia and the Pacific.
- Inter-Parliamentary Union (IPU Parline) DPRK Archive.
- Korean Central News Agency (KCNA) official election announcements (1998, 2003, 2009, 2014, 2019, 2023).
"""

import csv
import json
import os

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../samples/society"))
os.makedirs(SAMPLE_DIR, exist_ok=True)

# Complete verified historical election data for DPRK SPA and 2023 local elections
SPA_ELECTIONS = [
    {"term": "1st SPA", "date": "1948-08-25", "year": 1948, "seats": 572, "turnout_pct": 99.97, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "360 deputies claimed from South Korea; 212 from North Korea"},
    {"term": "2nd SPA", "date": "1957-08-27", "year": 1957, "seats": 215, "turnout_pct": 99.99, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "Post-war consolidation; 99.92% for Fatherland Front candidates"},
    {"term": "3rd SPA", "date": "1962-10-08", "year": 1962, "seats": 383, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "First officially reported 100% turnout"},
    {"term": "4th SPA", "date": "1967-11-25", "year": 1967, "seats": 457, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "Purge of Kapsan faction; 100% turnout and 100% yes"},
    {"term": "5th SPA", "date": "1972-12-12", "year": 1972, "seats": 541, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "Socialist Constitution adopted; Kim Il Sung elected President"},
    {"term": "6th SPA", "date": "1977-11-11", "year": 1977, "seats": 579, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "100% turnout and 100% vote reported"},
    {"term": "7th SPA", "date": "1982-02-28", "year": 1982, "seats": 615, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "Kim Il Sung's 70th birthday year; 100% turnout"},
    {"term": "8th SPA", "date": "1986-11-02", "year": 1986, "seats": 655, "turnout_pct": 100.00, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / KCNA", "notes": "100% turnout and 100% vote reported"},
    {"term": "9th SPA", "date": "1990-04-22", "year": 1990, "seats": 687, "turnout_pct": 99.78, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "Nohlen et al. / IPU", "notes": "Last election under Kim Il Sung; slight shortfall due to citizens at sea"},
    {"term": "10th SPA", "date": "1998-07-26", "year": 1998, "seats": 687, "turnout_pct": 99.85, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "IPU / KCNA", "notes": "Delayed by famine and Kim Il Sung 3-year mourning; Kim Jong Il Chairman of NDC"},
    {"term": "11th SPA", "date": "2003-08-03", "year": 2003, "seats": 687, "turnout_pct": 99.90, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "IPU / KCNA", "notes": "100% approval of all 687 candidates"},
    {"term": "12th SPA", "date": "2009-03-08", "year": 2009, "seats": 687, "turnout_pct": 99.98, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "IPU / KCNA", "notes": "Post-Kim Jong Il stroke; Kim Jong Un's succession maneuvering begins"},
    {"term": "13th SPA", "date": "2014-03-09", "year": 2014, "seats": 687, "turnout_pct": 99.97, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "IPU / KCNA", "notes": "First parliamentary election under Kim Jong Un (elected in Constituency 111, Paektusan)"},
    {"term": "14th SPA", "date": "2019-03-10", "year": 2019, "seats": 687, "turnout_pct": 99.99, "vote_yes_pct": 100.0, "vote_no_pct": 0.0, "source": "IPU / KCNA", "notes": "Kim Jong Un not registered on ballot, establishing separation as head of state"},
    {"term": "Local Assemblies (Provincial)", "date": "2023-11-26", "year": 2023, "seats": 27858, "turnout_pct": 99.63, "vote_yes_pct": 99.91, "vote_no_pct": 0.09, "source": "KCNA / Rodong Sinmun", "notes": "First time DPRK state media ever officially reported dissenting votes (0.09% against)"},
    {"term": "Local Assemblies (City/County)", "date": "2023-11-26", "year": 2023, "seats": 27858, "turnout_pct": 99.63, "vote_yes_pct": 99.82, "vote_no_pct": 0.18, "source": "KCNA / Rodong Sinmun", "notes": "0.18% voted against candidates in city and county people's assemblies"}
]

def build_dataset():
    out_csv = os.path.join(SAMPLE_DIR, "spa_election_results.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["term", "date", "year", "seats", "turnout_pct", "vote_yes_pct", "vote_no_pct", "source", "notes"])
        for e in SPA_ELECTIONS:
            writer.writerow([
                e["term"], e["date"], e["year"], e["seats"],
                e["turnout_pct"], e["vote_yes_pct"], e["vote_no_pct"],
                e["source"], e["notes"]
            ])
    print(f"Saved SPA election results dataset to {out_csv}")

if __name__ == "__main__":
    build_dataset()
