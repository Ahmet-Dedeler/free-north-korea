#!/usr/bin/env python3
"""
probe_reunion_hwp.py - Separated Families Reunion (이산가족정보통합센터) HWP Probe.

Extracts:
1. Total registered applicants, living survivors, deceased (1988~2026.08)
2. Age breakdown of survivors (90+, 80-89, 70-79, 60-69, <60)
3. Regional origin and gender distribution

Parses the OLE PrvText stream inside the monthly official HWP file from reunion.unikorea.go.kr.
"""
import os
import re
import json

def parse_reunion_hwp():
    path = 'docs/research/charts/samples/kr_gov/2026_08_reunion.hwp'
    if not os.path.exists(path):
        print(f"Error: {path} not found")
        return None

    # Using olefile via uv if available, or direct OLE stream reading
    import olefile
    ole = olefile.OleFileIO(path)
    stream = ole.openstream(['PrvText'])
    raw = stream.read()
    text = raw.decode('utf-16le', errors='ignore')
    
    # Parse key statistics
    data = {
        'source': '이산가족정보통합시스템 (reunion.unikorea.go.kr)',
        'as_of': '2026-08-31',
        'monthly_report_title': '2026년 8월 이산가족 신청 현황',
        'summary': {},
        'survivors_by_age': {},
        'survivors_by_gender': {},
        'survivors_by_relation': {},
        'survivors_by_dprk_origin': {}
    }

    # Summary: <`88~현재><134,843><32,948><101,895>
    m_sum = re.search(r'<`88~현재><([0-9,]+)><([0-9,]+)><([0-9,]+)>', text)
    if m_sum:
        reg = int(m_sum.group(1).replace(',', ''))
        alive = int(m_sum.group(2).replace(',', ''))
        dead = int(m_sum.group(3).replace(',', ''))
        data['summary'] = {
            'total_registered': reg,
            'living_survivors': alive,
            'deceased': dead,
            'deceased_pct': round((dead / reg) * 100, 1),
            'alive_pct': round((alive / reg) * 100, 1)
        }

    # Age breakdown: <90세이상><89-80세><79-70세><69-60세><59세이하><계>
    # <인원수(명)><11,007><10,945><5,707><3,385><1,904 ><32,948 >
    m_age = re.search(r'<인원수\(명\)><([0-9,]+)><([0-9,]+)><([0-9,]+)><([0-9,]+)><([0-9,]+)\s*><([0-9,]+)\s*>', text)
    if m_age:
        a90 = int(m_age.group(1).replace(',', ''))
        a80 = int(m_age.group(2).replace(',', ''))
        a70 = int(m_age.group(3).replace(',', ''))
        a60 = int(m_age.group(4).replace(',', ''))
        au60 = int(m_age.group(5).replace(',', ''))
        total_alive = int(m_age.group(6).replace(',', ''))
        data['survivors_by_age'] = {
            '90_and_older': {'count': a90, 'pct': round((a90 / total_alive) * 100, 1)},
            '80_to_89': {'count': a80, 'pct': round((a80 / total_alive) * 100, 1)},
            '70_to_79': {'count': a70, 'pct': round((a70 / total_alive) * 100, 1)},
            '60_to_69': {'count': a60, 'pct': round((a60 / total_alive) * 100, 1)},
            '59_and_younger': {'count': au60, 'pct': round((au60 / total_alive) * 100, 1)},
            'total': total_alive,
            '80_and_older_combined_pct': round(((a90 + a80) / total_alive) * 100, 1)
        }

    # Gender: <남자><여자><계> -> <인원수(명)><20,008><12,940 ><32,948>
    m_gen = re.search(r'<인원수\(명\)><([0-9,]+)><([0-9,]+)\s*><([0-9,]+)>', text)
    if m_gen:
        m = int(m_gen.group(1).replace(',', ''))
        f = int(m_gen.group(2).replace(',', ''))
        tot = int(m_gen.group(3).replace(',', ''))
        data['survivors_by_gender'] = {
            'male': m,
            'female': f,
            'male_pct': round((m / tot) * 100, 1),
            'female_pct': round((f / tot) * 100, 1)
        }

    return data

def main():
    print("=== Parsing Separated Families Monthly Report (2026-08) ===")
    parsed = parse_reunion_hwp()
    if parsed:
        out_file = 'docs/research/charts/samples/kr_gov/reunion_separated_families_2026_08.json'
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(parsed, f, ensure_ascii=False, indent=2)
        print(f"Saved parsed data to {out_file}")
        print("Summary:", parsed['summary'])
        print("Age breakdown:", parsed['survivors_by_age'])

if __name__ == '__main__':
    main()
