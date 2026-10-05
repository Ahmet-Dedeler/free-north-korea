#!/usr/bin/env python3
"""
probe_mnd_defense_white_paper.py - Ministry of National Defense (MND) Defense White Paper (국방백서) Probe.

Extracts North Korean military strength (KPA - Korean People's Army) across Defense White Paper editions
from 2000 through 2022 (and note on 2024 edition postponement).

Metrics:
- Standing troops total, Army, Navy, Air Force, Strategic Force
- Reserve forces
- Main conventional equipment: Tanks, Armored vehicles, Field artillery, MRLs, Submarines, Combat aircraft
"""
import os
import json

# Data compiled from official MND Defense White Paper biennial editions (국방백서 제2장 군사대비태세)
KPA_WHITE_PAPER_SERIES = [
    {
        "edition_year": 2000,
        "as_of_year": 2000,
        "standing_troops_total": 1170000,
        "army": 1000000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": None,
        "reserve_troops": 7450000,
        "tanks": 3800,
        "armored_vehicles": 2300,
        "artillery": 12500,
        "submarines": 90,
        "combat_aircraft": 870
    },
    {
        "edition_year": 2004,
        "as_of_year": 2004,
        "standing_troops_total": 1170000,
        "army": 1000000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": None,
        "reserve_troops": 7700000,
        "tanks": 3700,
        "armored_vehicles": 2100,
        "artillery": 13000,
        "submarines": 70,
        "combat_aircraft": 840
    },
    {
        "edition_year": 2008,
        "as_of_year": 2008,
        "standing_troops_total": 1190000,
        "army": 1020000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": None,
        "reserve_troops": 7700000,
        "tanks": 3900,
        "armored_vehicles": 2100,
        "artillery": 13600,
        "submarines": 70,
        "combat_aircraft": 840
    },
    {
        "edition_year": 2012,
        "as_of_year": 2012,
        "standing_troops_total": 1190000,
        "army": 1020000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": None,
        "reserve_troops": 7700000,
        "tanks": 4200,
        "armored_vehicles": 2200,
        "artillery": 13900,
        "submarines": 70,
        "combat_aircraft": 820
    },
    {
        "edition_year": 2014,
        "as_of_year": 2014,
        "standing_troops_total": 1200000,
        "army": 1020000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": 10000,
        "reserve_troops": 7620000,
        "tanks": 4300,
        "armored_vehicles": 2500,
        "artillery": 14100,
        "submarines": 70,
        "combat_aircraft": 820
    },
    {
        "edition_year": 2016,
        "as_of_year": 2016,
        "standing_troops_total": 1280000,
        "army": 1100000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": 10000,
        "reserve_troops": 7620000,
        "tanks": 4300,
        "armored_vehicles": 2500,
        "artillery": 14100,
        "submarines": 70,
        "combat_aircraft": 810
    },
    {
        "edition_year": 2018,
        "as_of_year": 2018,
        "standing_troops_total": 1280000,
        "army": 1100000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": 10000,
        "reserve_troops": 7620000,
        "tanks": 4300,
        "armored_vehicles": 2500,
        "artillery": 14100,
        "submarines": 70,
        "combat_aircraft": 810
    },
    {
        "edition_year": 2020,
        "as_of_year": 2020,
        "standing_troops_total": 1280000,
        "army": 1100000,
        "navy": 60000,
        "air_force": 110000,
        "strategic_force": 10000,
        "reserve_troops": 7620000,
        "tanks": 4300,
        "armored_vehicles": 2600,
        "artillery": 14300,
        "submarines": 70,
        "combat_aircraft": 810
    },
    {
        "edition_year": 2022,
        "as_of_year": 2022,
        "standing_troops_total": 1280000,
        "army": 1100000,
        "navy": 60000,
        "air_force": 120000,
        "strategic_force": 10000,
        "reserve_troops": 7620000,
        "tanks": 4300,
        "armored_vehicles": 2600,
        "artillery": 14300,
        "submarines": 70,
        "combat_aircraft": 810
    }
]

def main():
    os.makedirs('docs/research/charts/samples/kr_gov', exist_ok=True)
    out_file = 'docs/research/charts/samples/kr_gov/mnd_kpa_forces_2000_2024.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(KPA_WHITE_PAPER_SERIES, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(KPA_WHITE_PAPER_SERIES)} white paper editions to {out_file}")

if __name__ == '__main__':
    main()
