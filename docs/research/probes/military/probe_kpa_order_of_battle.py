#!/usr/bin/env python3
"""
Probe script: Compile and verify Korean People's Army (KPA) Order of Battle,
Corps Headquarters coordinates, and DMZ front-line deployment data.
"""
import json

KPA_CORPS = [
    {
        "id": "kpa-1st-corps",
        "name": "KPA 1st Corps (제1군단)",
        "location": "Hoeyang-eup, Kumgang County, Kangwon Province",
        "lat": 38.6983,
        "lon": 127.9150,
        "echelon": "Forward Front Line (Eastern DMZ)",
        "role": "Guards eastern sector of DMZ opposing ROK 1st Field Army; controls hardened artillery caves overlooking Goseong / Sokcho axis."
    },
    {
        "id": "kpa-2nd-corps",
        "name": "KPA 2nd Corps (제2군단)",
        "location": "Kumchon / Pyongsan County, North Hwanghae Province",
        "lat": 38.3183,
        "lon": 126.4383,
        "echelon": "Forward Front Line (Western DMZ / Kaesong corridor)",
        "role": "Guards the primary invasion route toward Seoul (Munsan corridor); controls extensive underground tunnel complexes and 170mm SPG artillery positions."
    },
    {
        "id": "kpa-4th-corps",
        "name": "KPA 4th Corps (제4군단)",
        "location": "Haeju, South Hwanghae Province",
        "lat": 38.0406,
        "lon": 125.7144,
        "echelon": "Forward Front Line (West Sea / NLL sector)",
        "role": "Controls coastal defense artillery, Silkworm/Kumsong anti-ship missile batteries, and amphibious hovercraft bases facing the ROK Northwest Islands (Baengnyeong, Yeonpyeong)."
    },
    {
        "id": "kpa-5th-corps",
        "name": "KPA 5th Corps (제5군단)",
        "location": "Pyonggang / Sepo County, Kangwon Province",
        "lat": 38.4061,
        "lon": 127.2847,
        "echelon": "Forward Front Line (Central DMZ / Cheorwon corridor)",
        "role": "Guards central Iron Triangle and Cheorwon invasion corridor toward Seoul; high concentration of multiple rocket launchers (240mm MRLs)."
    },
    {
        "id": "kpa-3rd-corps",
        "name": "KPA 3rd Corps (제3군단)",
        "location": "Nampo, South Pyongan Province",
        "lat": 38.7375,
        "lon": 125.4078,
        "echelon": "Rear Defense Echelon (West Coast)",
        "role": "Defends western approach to Pyongyang and key industrial/port infrastructure along the Taedong River."
    },
    {
        "id": "kpa-7th-corps",
        "name": "KPA 7th Corps (제7군단)",
        "location": "Hamhung, South Hamgyong Province",
        "lat": 39.9183,
        "lon": 127.5364,
        "echelon": "Rear Defense Echelon (East Coast)",
        "role": "Protects industrial/naval hubs of Hamhung and Hungnam; acts as eastern operational reserve."
    },
    {
        "id": "kpa-8th-corps",
        "name": "KPA 8th Corps (제8군단)",
        "location": "Yomju / Panghyon, North Pyongan Province",
        "lat": 39.8800,
        "lon": 125.2000,
        "echelon": "Border / Coastal Defense (Northwest)",
        "role": "Defends Yellow Sea coast near Chinese border and covers strategic rocket testing corridors."
    },
    {
        "id": "kpa-9th-corps",
        "name": "KPA 9th Corps (제9군단)",
        "location": "Kyongsong / Chongjin, North Hamgyong Province",
        "lat": 41.5878,
        "lon": 129.6050,
        "echelon": "Border / Coastal Defense (Northeast)",
        "role": "Guards northeast border with China/Russia and Chongjin port (historically replaced the 6th Corps after 1995 attempted coup)."
    },
    {
        "id": "kpa-10th-corps",
        "name": "KPA 10th Corps (제10군단)",
        "location": "Hyesan, Ryanggang Province",
        "lat": 41.4017,
        "lon": 128.1783,
        "echelon": "Border Guard Echelon (Yalu/Tumen rivers)",
        "role": "Internal security, anti-defection border interdiction along Yalu River, and guarding nuclear test sites/missile silos in Ryanggang."
    },
    {
        "id": "kpa-11th-corps",
        "name": "KPA 11th Corps / Storm Corps (폭풍군단 / 특수작전군)",
        "location": "Tokchon, South Pyongan Province",
        "lat": 39.7547,
        "lon": 126.0153,
        "echelon": "Special Operations Force (Strategic Reserve / Deployed)",
        "role": "Elite special operations force (~10,000-12,000 troops); 2024-2026 deployed to Russia (Kursk Oblast) and Russian Far East training grounds."
    },
    {
        "id": "kpa-12th-corps",
        "name": "KPA 12th Corps (제12군단)",
        "location": "Kanggye, Chagang Province",
        "lat": 40.9694,
        "lon": 126.5853,
        "echelon": "Mountain Border Defense",
        "role": "Established 2010 to defend the rugged mountainous border in Chagang Province adjacent to China and secure deep underground arms production plants."
    },
    {
        "id": "kpa-820th-tank-corps",
        "name": "KPA 820th Tank Corps (제820전차군단)",
        "location": "Sariwon, North Hwanghae Province",
        "lat": 38.5078,
        "lon": 125.7544,
        "echelon": "Mechanized Strike Echelon",
        "role": "Primary armored breakout force equipped with Pokpung-ho, Chonma-ho, and M2020/M2024 main battle tanks."
    },
    {
        "id": "kpa-strategic-force",
        "name": "KPA Strategic Rocket Force Command (전략군사령부)",
        "location": "Songchon County, South Pyongan Province (Baegwon Station) / Pyongyang",
        "lat": 39.2483,
        "lon": 126.2167,
        "echelon": "Strategic Nuclear / Ballistic Command",
        "role": "Direct command over North Korea's strategic missile brigades, nuclear TELs, and undeclared missile operating bases."
    }
]

def main():
    print(f"KPA Corps Headquarters compiled: {len(KPA_CORPS)}")
    print(json.dumps(KPA_CORPS[:2], indent=2))

if __name__ == "__main__":
    main()
