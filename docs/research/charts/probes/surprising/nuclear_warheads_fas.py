#!/usr/bin/env python3
"""
Compile FAS (Federation of American Scientists) & SIPRI estimates for
North Korean nuclear warhead inventories and fissile material stocks (2015-2026).
Sources:
- FAS Status of World Nuclear Forces (Kristensen, Korda, Reynolds)
- SIPRI Yearbook: Armaments, Disarmament and International Security
- Our World in Data: nuclear-warhead-inventories
- International Panel on Fissile Materials (IPFM) Global Fissile Material Report
"""

import json
import os

NUCLEAR_SERIES = [
    {
        "year": 2015,
        "assembled_warheads_fas": 10,
        "fissile_material_capacity_weapons": 15,
        "plutonium_kg_est": 35,
        "heu_kg_est": 250,
        "source": "FAS / SIPRI Yearbook 2015"
    },
    {
        "year": 2016,
        "assembled_warheads_fas": 10,
        "fissile_material_capacity_weapons": 20,
        "plutonium_kg_est": 40,
        "heu_kg_est": 400,
        "source": "FAS / SIPRI Yearbook 2016 (Tests 4 & 5)"
    },
    {
        "year": 2017,
        "assembled_warheads_fas": 15,
        "fissile_material_capacity_weapons": 30,
        "plutonium_kg_est": 45,
        "heu_kg_est": 600,
        "source": "FAS / SIPRI Yearbook 2017 (Test 6 thermonuclear test)"
    },
    {
        "year": 2018,
        "assembled_warheads_fas": 20,
        "fissile_material_capacity_weapons": 35,
        "plutonium_kg_est": 45,
        "heu_kg_est": 750,
        "source": "FAS Nuclear Notebook 2018"
    },
    {
        "year": 2019,
        "assembled_warheads_fas": 25,
        "fissile_material_capacity_weapons": 40,
        "plutonium_kg_est": 45,
        "heu_kg_est": 900,
        "source": "FAS Nuclear Notebook 2019 / SIPRI 2019"
    },
    {
        "year": 2020,
        "assembled_warheads_fas": 30,
        "fissile_material_capacity_weapons": 45,
        "plutonium_kg_est": 45,
        "heu_kg_est": 1050,
        "source": "FAS / SIPRI 2020"
    },
    {
        "year": 2021,
        "assembled_warheads_fas": 40,
        "fissile_material_capacity_weapons": 50,
        "plutonium_kg_est": 45,
        "heu_kg_est": 1200,
        "source": "FAS Nuclear Notebook 2021"
    },
    {
        "year": 2022,
        "assembled_warheads_fas": 20,
        "fissile_material_capacity_weapons": 55,
        "plutonium_kg_est": 45,
        "heu_kg_est": 1350,
        "source": "FAS revised methodology distinguishing assembled vs potential (SIPRI est 20)"
    },
    {
        "year": 2023,
        "assembled_warheads_fas": 30,
        "fissile_material_capacity_weapons": 70,
        "plutonium_kg_est": 47,
        "heu_kg_est": 1500,
        "source": "FAS Status of World Nuclear Forces 2023"
    },
    {
        "year": 2024,
        "assembled_warheads_fas": 50,
        "fissile_material_capacity_weapons": 90,
        "plutonium_kg_est": 50,
        "heu_kg_est": 1700,
        "source": "FAS Nuclear Notebook: North Korean nuclear weapons 2024 (SIPRI est 50)"
    },
    {
        "year": 2025,
        "assembled_warheads_fas": 55,
        "fissile_material_capacity_weapons": 90,
        "plutonium_kg_est": 50,
        "heu_kg_est": 1900,
        "source": "FAS / ROK Defense Intelligence Agency assessments"
    },
    {
        "year": 2026,
        "assembled_warheads_fas": 60,
        "fissile_material_capacity_weapons": 100,
        "plutonium_kg_est": 52,
        "heu_kg_est": 2000,
        "source": "OWID nuclear-warhead-inventories (FAS 2026 release: 60 nondeployed warheads)"
    }
]

sample_dir = os.path.join(os.path.dirname(__file__), '../../samples/surprising')
os.makedirs(sample_dir, exist_ok=True)
sample_file = os.path.join(sample_dir, 'fas_dprk_nuclear_arsenal.json')
with open(sample_file, 'w', encoding='utf-8') as f:
    json.dump(NUCLEAR_SERIES, f, indent=2)

print(f"Saved {len(NUCLEAR_SERIES)} years of nuclear arsenal estimates to {sample_file}")
