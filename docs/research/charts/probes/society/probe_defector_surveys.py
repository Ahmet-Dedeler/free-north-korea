#!/usr/bin/env python3
"""
Probe script: Seoul National University Institute for Peace and Unification Studies (SNU IPUS)
Surveys on Defectors' Perceptions and North Korean Social Change (북한이탈주민 통일의식 / 북한사회변동조사).
Directly extracts raw time series from IPUS infographic data repository:
1. Foreign media & South Korean TV/drama exposure inside DPRK (2-04-Sk03)
2. Retrospective Kim Jong Un regime approval rating while living inside DPRK (2-07-Nk02)
3. Bribery share of income paid to officials (3-08-q12)
4. Personal mobile phone ownership inside DPRK (3-03-q1_11_1)
5. Primary income source: private market (jangmadang) commerce vs state salary (3-09-q15)
6. South Korean public opinion on unification necessity (1-01-Uni01)
"""

import csv
import io
import json
import os
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../samples/society"))
os.makedirs(SAMPLE_DIR, exist_ok=True)

BASE_URL = "https://ipus.snu.ac.kr/wp-content/themes/ipus/graph/korea-unity-infographic/1-survey-data/"
HEADERS = {"User-Agent": "free-north-korea-research/1.0"}

def parse_xlsx_rows(url):
    req = urllib.request.Request(url, headers=HEADERS)
    content = urllib.request.urlopen(req, timeout=20).read()
    zf = zipfile.ZipFile(io.BytesIO(content))
    
    s_tree = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    s_list = [elem.text for elem in s_tree.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")]
    
    sheet = ET.fromstring(zf.read("xl/worksheets/sheet1.xml"))
    ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    rows = []
    for row in sheet.iter(f"{ns}row"):
        r_vals = []
        for cell in row.iter(f"{ns}c"):
            t = cell.get("t")
            v = cell.find(f"{ns}v")
            val = v.text if v is not None else ""
            if t == "s" and val:
                val = s_list[int(val)]
            r_vals.append(val)
        if any(r_vals):
            rows.append(r_vals)
    return rows

def build_dataset():
    print("Pulling SNU IPUS survey datasets...")
    # 1. Media exposure (2-04-Sk03)
    media_url = BASE_URL + "2-opinion-north/2-04-Sk03.xlsx"
    media_rows = parse_xlsx_rows(media_url)
    media_years = [int(float(y)) for y in media_rows[1] if y and y.replace('.', '', 1).isdigit()]
    media_frequent = [float(v) for v in media_rows[2][1:len(media_years)+1]]
    media_occasional = [float(v) for v in media_rows[3][1:len(media_years)+1]]
    media_never = [float(v) for v in media_rows[4][1:len(media_years)+1]]

    # 2. Kim Jong Un approval (2-07-Nk02)
    kim_url = BASE_URL + "2-opinion-north/2-07-Nk02.xlsx"
    kim_rows = parse_xlsx_rows(kim_url)
    kim_years = [int(float(y)) for y in kim_rows[1] if y and y.replace('.', '', 1).isdigit()]
    kim_low = [float(v) for v in kim_rows[2][1:len(kim_years)+1]]
    kim_neutral = [float(v) for v in kim_rows[3][1:len(kim_years)+1]]
    kim_high = [float(v) for v in kim_rows[4][1:len(kim_years)+1]]

    # 3. Bribery share of income (3-08-q12)
    bribe_url = BASE_URL + "3-society-north/3-08-q12.xlsx"
    bribe_rows = parse_xlsx_rows(bribe_url)
    bribe_years = [int(float(y)) for y in bribe_rows[1] if y and y.replace('.', '', 1).isdigit()]
    bribe_none = [float(v) for v in bribe_rows[2][1:len(bribe_years)+1]]
    bribe_under30 = [float(v) for v in bribe_rows[3][1:len(bribe_years)+1]]
    bribe_30to50 = [float(v) for v in bribe_rows[4][1:len(bribe_years)+1]]
    bribe_over50 = [float(v) for v in bribe_rows[5][1:len(bribe_years)+1]]

    # 4. Mobile phone ownership inside DPRK (3-03-q1_11_1)
    phone_url = BASE_URL + "3-society-north/3-03-q1_11_1.xlsx"
    phone_rows = parse_xlsx_rows(phone_url)
    phone_years = [int(float(y)) for y in phone_rows[1] if y and y.replace('.', '', 1).isdigit()]
    phone_owned = [float(v) for v in phone_rows[2][1:len(phone_years)+1]]

    # 5. South Korean Unification Necessity (1-01-Uni01)
    uni_url = BASE_URL + "1-opinion-south/1-01-Uni01.xlsx"
    uni_rows = parse_xlsx_rows(uni_url)
    uni_years = [int(float(y)) for y in uni_rows[1] if y and y.replace('.', '', 1).isdigit()]
    uni_necessary = [float(v) for v in uni_rows[2][1:len(uni_years)+1]]
    uni_unnecessary = [float(v) for v in uni_rows[4][1:len(uni_years)+1]]

    out_csv = os.path.join(SAMPLE_DIR, "snu_ipus_defector_trends.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "year",
            "foreign_media_exposure_total_pct",
            "foreign_media_frequent_pct",
            "kim_jong_un_approval_high_pct",
            "kim_jong_un_approval_low_pct",
            "bribe_experienced_total_pct",
            "bribe_heavy_over30pct_income",
            "mobile_phone_owned_inside_dprk_pct",
            "south_korea_unification_necessary_pct"
        ])
        all_years = sorted(list(set(media_years + kim_years + bribe_years + phone_years + uni_years)))
        for yr in all_years:
            # media
            if yr in media_years:
                idx = media_years.index(yr)
                f_med = round(media_frequent[idx] + media_occasional[idx], 1)
                f_freq = round(media_frequent[idx], 1)
            else:
                f_med, f_freq = "", ""

            # kim approval
            if yr in kim_years:
                idx = kim_years.index(yr)
                k_high = round(kim_high[idx], 1)
                k_low = round(kim_low[idx], 1)
            else:
                k_high, k_low = "", ""

            # bribe
            if yr in bribe_years:
                idx = bribe_years.index(yr)
                b_total = round(100.0 - bribe_none[idx], 1)
                b_heavy = round(bribe_30to50[idx] + bribe_over50[idx], 1)
            else:
                b_total, b_heavy = "", ""

            # phone
            if yr in phone_years:
                idx = phone_years.index(yr)
                p_own = round(phone_owned[idx], 1)
            else:
                p_own = ""

            # south korea unification
            if yr in uni_years:
                idx = uni_years.index(yr)
                u_nec = round(uni_necessary[idx], 1)
            else:
                u_nec = ""

            writer.writerow([yr, f_med, f_freq, k_high, k_low, b_total, b_heavy, p_own, u_nec])

    print(f"Saved SNU IPUS defector trends dataset to {out_csv}")

if __name__ == "__main__":
    build_dataset()
