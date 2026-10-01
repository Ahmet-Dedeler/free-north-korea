#!/usr/bin/env python3
"""
Probe script: Compile and verify geographic coordinates and metadata
for North Korean military airbases and naval bases from open sources.
"""
import json

AIRBASES = [
    {"id": "sunchon-ab", "name": "Sunchon Airbase", "lat": 39.4126, "lon": 125.8903, "type": "airbase", "unit": "Su-25 ground attack, MiG-29 fighters"},
    {"id": "wonsan-kalma", "name": "Wonsan Kalma Airport", "lat": 39.1677, "lon": 127.4817, "type": "dual-use airbase / missile launch", "unit": "MiG-21, transport"},
    {"id": "panghyon-ab", "name": "Panghyon Airbase", "lat": 39.9275, "lon": 125.2079, "type": "airbase / missile test / UAV factory", "unit": "Il-28 bombers, UAV development"},
    {"id": "sondok-ab", "name": "Sondok Airbase", "lat": 39.7437, "lon": 127.4732, "type": "airbase / transport HQ", "unit": "6th Air Transport Division (An-2)"},
    {"id": "kaechon-ab", "name": "Kaechon Airbase", "lat": 39.7523, "lon": 125.8999, "type": "airbase / combat HQ", "unit": "1st Air Combat Command HQ, MiG-21 fighters"},
    {"id": "hwangju-ab", "name": "Hwangju Airbase", "lat": 38.6868, "lon": 125.7020, "type": "airbase / combat HQ", "unit": "3rd Air Combat Command HQ, MiG-21 fighters"},
    {"id": "toksan-ab", "name": "Toksan Airbase", "lat": 39.9972, "lon": 127.6144, "type": "airbase / combat HQ", "unit": "2nd Air Combat Command HQ, MiG-21 fighters"},
    {"id": "kwail-ab", "name": "Kwail Airbase", "lat": 38.4215, "lon": 125.0244, "type": "airbase", "unit": "Su-25 attack aircraft"},
    {"id": "uiju-ab", "name": "Uiju Airbase", "lat": 40.0258, "lon": 124.5779, "type": "airbase / disinfection hub", "unit": "Il-28 bombers (converted during COVID to freight disinfection)"},
    {"id": "koksan-ab", "name": "Koksan Airbase", "lat": 38.7800, "lon": 126.6700, "type": "forward airbase", "unit": "MiG-17 / MiG-21 forward staging"},
    {"id": "taechon-ab", "name": "Taechon Airbase", "lat": 39.9857, "lon": 125.5186, "type": "transport HQ", "unit": "5th Air Transport Division"},
    {"id": "orang-ab", "name": "Orang Airbase (Chongjin)", "lat": 41.4286, "lon": 129.6517, "type": "training HQ", "unit": "8th Air Training Division"},
    {"id": "changjin-ab", "name": "Changjin Airbase", "lat": 40.6133, "lon": 127.4433, "type": "airbase", "unit": "High-altitude interceptor staging"},
    {"id": "pukchang-ab", "name": "Pukchang Airfield", "lat": 39.5044, "lon": 125.9643, "type": "fighter airbase", "unit": "MiG-23 fighters"},
    {"id": "sunan-ab", "name": "Sunan (Pyongyang Int'l)", "lat": 39.2002, "lon": 125.6733, "type": "dual-use airbase / ICBM launch", "unit": "Air Koryo / VIP transport / ICBM test site"}
]

NAVAL_BASES = [
    {"id": "nampo-fleet-hq", "name": "Nampo Naval Base & West Sea Fleet HQ", "lat": 38.7250, "lon": 125.3833, "fleet": "West Sea Fleet", "role": "Fleet Headquarters, shipyards, frigate/corvette berthing"},
    {"id": "pipagot-nb", "name": "Pipagot Naval Base", "lat": 38.5972, "lon": 124.9972, "fleet": "West Sea Fleet", "role": "Submarine / patrol craft forward base, underground submarine pens"},
    {"id": "sagot-nb", "name": "Sagot Naval Base", "lat": 37.8333, "lon": 125.3833, "fleet": "West Sea Fleet", "role": "Forward torpedo boat / patrol boat base near NLL"},
    {"id": "chodo-nb", "name": "Cho-do Naval Base", "lat": 38.5328, "lon": 124.8331, "fleet": "West Sea Fleet", "role": "Fast attack craft base (Squadron 9)"},
    {"id": "toejo-dong-hq", "name": "Toejo-dong Naval Base (East Sea Fleet HQ)", "lat": 39.8978, "lon": 127.7817, "fleet": "East Sea Fleet", "role": "East Sea Fleet Headquarters, submarine / frigate berths"},
    {"id": "munchon-nb", "name": "Munchon Naval Base", "lat": 39.3098, "lon": 127.3870, "fleet": "East Sea Fleet", "role": "Major surface fleet & missile boat base, Wonsan defense"},
    {"id": "sinpo-shipyard", "name": "Sinpo South Shipyard", "lat": 40.0368, "lon": 128.1839, "fleet": "East Sea Fleet", "role": "Ballistic missile submarine (SSB) construction & test facility"},
    {"id": "mayang-do-nb", "name": "Mayang-do Submarine Base", "lat": 39.9967, "lon": 128.1969, "fleet": "East Sea Fleet", "role": "Primary KPN submarine base (Romeo and Sang-O class)"},
    {"id": "chaho-nb", "name": "Chaho Naval Base", "lat": 40.2033, "lon": 128.6533, "fleet": "East Sea Fleet", "role": "Underground submarine shelter & berthing facility"},
    {"id": "rajin-nb", "name": "Rajin (Rason) Naval Base & Port", "lat": 42.2389, "lon": 130.3017, "fleet": "East Sea Fleet", "role": "Naval academy, frigate base, and DPRK-Russia munitions transfer port"}
]

def main():
    print(f"Airbases compiled: {len(AIRBASES)}")
    print(f"Naval bases compiled: {len(NAVAL_BASES)}")
    print("\nSample Airbase:")
    print(json.dumps(AIRBASES[0], indent=2))
    print("\nSample Naval Base:")
    print(json.dumps(NAVAL_BASES[0], indent=2))

if __name__ == "__main__":
    main()
