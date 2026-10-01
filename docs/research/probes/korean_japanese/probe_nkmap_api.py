#!/usr/bin/env python3
"""
Probe script for Ministry of Unification NKMap FastApi:
Endpoint: https://nkinfo.unikorea.go.kr/nkp/search/searchNKMapFastApi.do
Tests facility searching, pagination, attribute extraction, and coordinate transformation
from Korean 2000 Central Belt (EPSG:5186) to WGS84 (EPSG:4326).
"""
import urllib.request
import urllib.parse
import json
import math

def epsg5186_to_wgs84(x, y):
    """
    Approximate Transverse Mercator inverse projection for Korea Central Belt 2000 (EPSG:5186).
    Origin: Lat 38.0 N, Lon 127.0 E, False Easting: 200,000m, False Northing: 600,000m.
    Ellipsoid: GRS80 (a = 6378137.0, f = 1/298.257222101).
    """
    a = 6378137.0
    f = 1 / 298.257222101
    e2 = 2 * f - f * f
    e_prime2 = e2 / (1 - e2)
    k0 = 1.0  # Scale factor

    x0 = 200000.0
    y0 = 600000.0
    lat0 = math.radians(38.0)
    lon0 = math.radians(127.0)

    dx = x - x0
    dy = y - y0

    # Meridian distance M0 for origin latitude
    def meridian_dist(phi):
        return a * (
            (1 - e2/4 - 3*e2*e2/64 - 5*e2**3/256) * phi
            - (3*e2/8 + 3*e2*e2/32 + 45*e2**3/1024) * math.sin(2*phi)
            + (15*e2*e2/256 + 45*e2**3/1024) * math.sin(4*phi)
            - (35*e2**3/3072) * math.sin(6*phi)
        )

    M = meridian_dist(lat0) + dy / k0

    # Footprint latitude mu
    mu = M / (a * (1 - e2/4 - 3*e2*e2/64 - 5*e2**3/256))
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    phi1 = mu + (3*e1/2 - 27*e1**3/32)*math.sin(2*mu) + (21*e1*e1/16 - 55*e1**4/32)*math.sin(4*mu) + (151*e1**3/96)*math.sin(6*mu)

    # Footprint radius and parameters
    sin_phi1 = math.sin(phi1)
    cos_phi1 = math.cos(phi1)
    tan_phi1 = math.tan(phi1)
    N1 = a / math.sqrt(1 - e2 * sin_phi1**2)
    R1 = a * (1 - e2) / ((1 - e2 * sin_phi1**2)**1.5)
    D = dx / (N1 * k0)

    # Coordinates
    lat = phi1 - (N1 * tan_phi1 / R1) * (
        D*D/2 - (5 + 3*tan_phi1**2 + 10*e_prime2*cos_phi1**2 - 4*e_prime2**2*cos_phi1**4 - 9*e_prime2)*D**4/24
        + (61 + 90*tan_phi1**2 + 298*e_prime2*cos_phi1**2 + 45*tan_phi1**4 - 252*e_prime2 - 3*e_prime2**2)*D**6/720
    )
    lon = lon0 + (
        D - (1 + 2*tan_phi1**2 + e_prime2*cos_phi1**2)*D**3/6
        + (5 - 2*e_prime2*cos_phi1**2 + 28*tan_phi1**2 - 3*e_prime2**2*cos_phi1**4 + 8*e_prime2 + 24*tan_phi1**4)*D**5/120
    ) / cos_phi1

    return math.degrees(lat), math.degrees(lon)

def query_nkmap(query="평양", page=1, size=5):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Referer': 'https://nkinfo.unikorea.go.kr/NKMap/',
        'Accept': 'application/json'
    }
    params = urllib.parse.urlencode({'q': query, 'page': page, 'size': size})
    url = f"https://nkinfo.unikorea.go.kr/nkp/search/searchNKMapFastApi.do?{params}"
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        
    print(f"Query: '{query}' -> Total: {data.get('total')} records")
    for it in data.get('items', []):
        x, y = it.get('x_crdnt'), it.get('y_crdnt')
        lat, lon = epsg5186_to_wgs84(x, y) if x and y else (None, None)
        print(f" - [{it['indx']}] {it['data_ttl']} ({it.get('ctgry_nm', '')})")
        print(f"   Address: {it.get('addr', '')}")
        print(f"   Coordinates: EPSG:5186 ({x:.1f}, {y:.1f}) -> WGS84 ({lat:.6f}°N, {lon:.6f}°E)")
        if it.get('attrbs'):
            print(f"   Attributes ({len(it['attrbs'])}): {[a['attrb_nm'] + ': ' + a['attrb_val'][:30] for a in it['attrbs'][:2]]}")
        print()

if __name__ == "__main__":
    query_nkmap("평양승강기공장", 1, 2)
    query_nkmap("김일성종합대학", 1, 2)
