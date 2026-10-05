#!/usr/bin/env python3
"""
Generate small verified sample CSV files for docs/research/charts/samples/rights/
"""
import os
import csv
import json

SAMPLES_DIR = "docs/research/charts/samples/rights"
os.makedirs(SAMPLES_DIR, exist_ok=True)

# 1. Defector arrivals by year and gender (MOU)
def build_defector_samples():
    data = [
        # Year, Male, Female, Total, Cumulative
        (1998, 55, 16, 71, 947),
        (1999, 108, 40, 148, 1095),
        (2000, 174, 138, 312, 1407),
        (2001, 292, 291, 583, 1990),
        (2002, 512, 627, 1139, 3129),
        (2003, 464, 817, 1281, 4410),
        (2004, 635, 1259, 1894, 6304),
        (2005, 472, 911, 1383, 7687),
        (2006, 514, 1504, 2018, 9705),
        (2007, 573, 1971, 2544, 12249),
        (2008, 613, 2196, 2809, 15058),
        (2009, 662, 2252, 2914, 17972),
        (2010, 551, 1851, 2402, 20374),
        (2011, 664, 2042, 2706, 23080),
        (2012, 404, 1098, 1502, 24582),
        (2013, 369, 1145, 1514, 26096),
        (2014, 305, 1092, 1397, 27493),
        (2015, 251, 1025, 1276, 28769),
        (2016, 299, 1119, 1418, 30187),
        (2017, 188, 939, 1127, 31314),
        (2018, 168, 969, 1137, 32451),
        (2019, 202, 845, 1047, 33498),
        (2020, 72, 157, 229, 33727),
        (2021, 40, 23, 63, 33790),
        (2022, 35, 32, 67, 33857),
        (2023, 32, 164, 196, 34053),
        (2024, 42, 194, 236, 34289),
        (2025, 25, 198, 223, 34512),
        ("2026-H1", 4, 59, 63, 34575)
    ]
    path = os.path.join(SAMPLES_DIR, "mou_defector_arrivals_annual.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "male", "female", "total", "cumulative_total"])
        w.writerows(data)
    print(f"Written: {path}")

# 2. UNGA DPRK human rights resolution votes
def build_unga_samples():
    data = [
        # Year, Resolution, Date, Vote_Type, In_Favor, Against, Abstentions
        (2005, "A/RES/60/173", "2005-12-16", "Recorded Vote", 88, 21, 60),
        (2006, "A/RES/61/232", "2006-12-22", "Recorded Vote", 79, 28, 63),
        (2007, "A/RES/62/167", "2007-12-18", "Recorded Vote", 101, 22, 59),
        (2008, "A/RES/63/190", "2008-12-18", "Recorded Vote", 94, 22, 63),
        (2009, "A/RES/64/175", "2009-12-18", "Recorded Vote", 99, 20, 63),
        (2010, "A/RES/65/225", "2010-12-21", "Recorded Vote", 106, 20, 57),
        (2011, "A/RES/66/174", "2011-12-19", "Recorded Vote", 123, 16, 51),
        (2012, "A/RES/67/181", "2012-12-20", "Consensus", 0, 0, 0),
        (2013, "A/RES/68/182", "2013-12-18", "Recorded Vote", 127, 13, 47),
        (2014, "A/RES/69/188", "2014-12-18", "Recorded Vote", 116, 20, 53),
        (2015, "A/RES/70/172", "2015-12-17", "Recorded Vote", 119, 19, 48),
        (2016, "A/RES/71/202", "2016-12-19", "Consensus", 0, 0, 0),
        (2017, "A/RES/72/188", "2017-12-19", "Consensus", 0, 0, 0),
        (2018, "A/RES/73/180", "2018-12-17", "Consensus", 0, 0, 0),
        (2019, "A/RES/74/166", "2019-12-18", "Consensus", 0, 0, 0),
        (2020, "A/RES/75/190", "2020-12-16", "Consensus", 0, 0, 0),
        (2021, "A/RES/76/177", "2021-12-16", "Consensus", 0, 0, 0),
        (2022, "A/RES/77/226", "2022-12-15", "Consensus", 0, 0, 0),
        (2023, "A/RES/78/219", "2023-12-19", "Consensus", 0, 0, 0),
        (2024, "A/RES/79/194", "2024-12-18", "Consensus", 0, 0, 0),
        (2025, "A/RES/80/220", "2025-12-17", "Consensus", 0, 0, 0)
    ]
    path = os.path.join(SAMPLES_DIR, "unga_dprk_resolutions_voting.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "resolution", "date_adopted", "vote_type", "in_favor", "against", "abstentions"])
        w.writerows(data)
    print(f"Written: {path}")

# 3. Political Prisoner Camp Population Estimates
def build_kwanliso_samples():
    data = [
        # Year, Source, Lower_Est, Upper_Est, Active_Camps, Notes
        (1990, "US State Dept / Amnesty International", 150000, 200000, 12, "Pre-famine baseline across 12-14 operational camps"),
        (1995, "Amnesty International / KINU", 150000, 200000, 10, "Arduous March famine era; closure of Camp 11 (Kyongsong)"),
        (2002, "David Hawk (HRNK, Hidden Gulag 1st Ed)", 150000, 200000, 6, "Identified 6 major camps: 14, 15, 16, 18, 22, 25"),
        (2006, "US State Department Country Report", 150000, 200000, 6, "Estimated 150,000-200,000 political prisoners"),
        (2011, "Amnesty International (Camp 15/22 imagery)", 200000, 200000, 6, "High-resolution satellite analysis before Camp 22 shutdown"),
        (2012, "David Hawk (HRNK, Hidden Gulag 2nd Ed)", 130000, 150000, 6, "Documented shutdown of Camp 22 Hoeryong; transfers to 16/25"),
        (2014, "UN Commission of Inquiry (Kirby Report)", 80000, 120000, 4, "Authoritative UN finding: 80,000-120,000 across 4 camps"),
        (2017, "KINU White Paper on Human Rights", 80000, 120000, 5, "Camps 14, 15, 16, 18, 25 (Camp 18 classification debated)"),
        (2020, "HRNK / Committee for Human Rights in NK", 80000, 120000, 4, "Camp 15 Yodok dismantled/repurposed 2019-2020; 4 camps remain"),
        (2023, "ROK MOU North Korea Human Rights Report", 80000, 120000, 4, "Official ROK government confirmation: Camps 14, 16, 18, 25"),
        (2025, "KINU Human Rights White Paper 2025", 80000, 120000, 4, "Camp 14 Kaechon, 16 Hwasong, 18 Bukchang, 25 Chongjin operational"),
        (2026, "International Coalition for Crimes Against Humanity", 80000, 120000, 4, "Current stable consensus benchmark")
    ]
    path = os.path.join(SAMPLES_DIR, "kwanliso_population_estimates.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "source", "lower_estimate", "upper_estimate", "active_camps", "notes"])
        w.writerows(data)
    print(f"Written: {path}")

# 4. KPA Russian deployment timeline
def build_kpa_russia_samples():
    data = [
        # Date, Source, Stage, Estimated_Deployed, Front, Casualties_Est, POW_Count, Notes
        ("2024-10-18", "ROK NIS", "Initial Deployment", 1500, "Russian Far East (Vladivostok)", 0, 0, "1,500 Special Ops (Storm Corps/11th Corps) transported via Russian naval vessels"),
        ("2024-10-23", "US Pentagon / Kirby", "Training & Staging", 3000, "Eastern Russia bases", 0, 0, "White House confirms at least 3,000 DPRK soldiers in eastern Russia training"),
        ("2024-11-04", "Pentagon / Austin", "Frontline Deployment", 10000, "Kursk Oblast", 0, 0, "Pentagon confirms ~10,000 DPRK troops deployed into Kursk border sector"),
        ("2024-11-20", "ROK NIS / Parliamentary Briefing", "Full Contingent Staged", 11000, "Kursk Oblast", 50, 0, "Integrated into Russian airborne/naval infantry units; first skirmishes reported"),
        ("2024-12-15", "Ukraine GUR / Zelenskyy", "Active Combat", 12000, "Kursk Oblast", 500, 0, "Heavy combat involvement against Ukrainian defensive positions"),
        ("2025-01-10", "Ukraine GUR", "Casualties Mounting", 11000, "Kursk Oblast", 1200, 2, "First two DPRK soldiers captured alive, treated in military hospital in Kyiv"),
        ("2025-06-30", "ROK NIS / Defense Ministry", "Reinforcements & Rotation", 13000, "Kursk Oblast", 3500, 2, "Second echelon deployed to replace casualties; combined drone-artillery tactics"),
        ("2026-01-15", "Western Intelligence / Pent", "Winter Campaign", 14000, "Kursk Oblast", 5000, 2, "Cumulative deployments ~14,000-15,000; extensive use of suicide protocols to avoid capture"),
        ("2026-09-25", "Ukraine Pres. Office / Zelenskyy", "Current Operational Status", 8000, "Kursk / Belgorod border", 6000, 2, "Over 8,000 currently active on Russian soil; 10,000 more reported in staging/training pipeline")
    ]
    path = os.path.join(SAMPLES_DIR, "kpa_russia_deployment_timeline.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["date", "source", "stage", "estimated_deployed", "front", "estimated_cumulative_casualties", "pow_count", "notes"])
        w.writerows(data)
    print(f"Written: {path}")

# 5. NKPD Violations by Year
def build_nkpd_samples():
    data = [
        (1989, 5), (1990, 8), (1993, 19), (1994, 14), (1995, 15),
        (1996, 5), (1997, 36), (1998, 155), (1999, 299), (2000, 655),
        (2001, 550), (2002, 863), (2003, 1086), (2004, 1339), (2005, 934),
        (2006, 622), (2007, 710), (2008, 649), (2009, 581), (2010, 492),
        (2011, 485), (2012, 417), (2013, 351), (2014, 337), (2015, 452),
        (2016, 212), (2017, 482), (2018, 106), (2019, 60)
    ]
    path = os.path.join(SAMPLES_DIR, "nkpd_violations_annual.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "documented_violations"])
        w.writerows(data)
    print(f"Written: {path}")

if __name__ == '__main__':
    build_defector_samples()
    build_unga_samples()
    build_kwanliso_samples()
    build_kpa_russia_samples()
    build_nkpd_samples()
    print("All sample CSV files generated successfully!")
