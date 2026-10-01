#!/usr/bin/env python3
"""
Build and validate script for leadership.json.
Merges organizations and people from modular data sources,
enforces strict schema validation and referential integrity,
and generates docs/research/leadership.json.
"""

import json
import os
import sys

from data_orgs import ORGS
from data_people_kim_family import PEOPLE_KIM_FAMILY
from data_people_politburo_military import PEOPLE_POLITBURO_MILITARY
from data_people_security_cyber import PEOPLE_SECURITY_CYBER
from data_people_science_economy import PEOPLE_SCIENCE_ECONOMY
from data_people_diplomats_purged import PEOPLE_DIPLOMATS_PURGED

ALLOWED_TAGS = {
    "family", "politburo", "military", "security", "cyber",
    "missile", "diplomat", "purged", "defector", "economy"
}

ALLOWED_RELATIONS = {
    "father", "mother", "spouse", "child", "sibling",
    "half-sibling", "uncle", "aunt", "niece", "nephew", "in-law"
}

ALLOWED_STATUS = {
    "alive", "dead", "purged", "executed", "defected", "unknown"
}

ALLOWED_CONFIDENCE = {
    "confirmed", "reported", "rumor"
}

ALLOWED_SANCTIONS_LISTS = {
    "OFAC", "UN", "EU", "UK", "JP", "KR"
}

def validate_and_build():
    errors = []

    people = (
        PEOPLE_KIM_FAMILY +
        PEOPLE_POLITBURO_MILITARY +
        PEOPLE_SECURITY_CYBER +
        PEOPLE_SCIENCE_ECONOMY +
        PEOPLE_DIPLOMATS_PURGED
    )

    orgs = ORGS

    print(f"Total people to process: {len(people)}")
    print(f"Total orgs to process: {len(orgs)}")

    # 1. Unique IDs check
    person_ids = set()
    for p in people:
        pid = p.get("id")
        if not pid:
            errors.append("Person missing 'id'")
        elif pid in person_ids:
            errors.append(f"Duplicate person id: '{pid}'")
        person_ids.add(pid)

    org_ids = set()
    for o in orgs:
        oid = o.get("id")
        if not oid:
            errors.append("Org missing 'id'")
        elif oid in org_ids:
            errors.append(f"Duplicate org id: '{oid}'")
        org_ids.add(oid)

    # 2. Org validation
    for o in orgs:
        oid = o["id"]
        # parent_org_id check
        p_org = o.get("parent_org_id")
        if p_org and p_org not in org_ids:
            errors.append(f"Org '{oid}' parent_org_id '{p_org}' not found in orgs")
        # head_person_id check
        h_person = o.get("head_person_id")
        if h_person and h_person not in person_ids:
            errors.append(f"Org '{oid}' head_person_id '{h_person}' not found in people")
        # sanctions check
        for s in o.get("sanctions", []):
            if s.get("list") not in ALLOWED_SANCTIONS_LISTS:
                errors.append(f"Org '{oid}' has invalid sanctions list: '{s.get('list')}'")

    # 3. Person validation
    for p in people:
        pid = p["id"]

        # required keys
        for key in ["name_en", "name_ko", "status", "gender", "roles", "family", "summary", "tags"]:
            if key not in p:
                errors.append(f"Person '{pid}' missing required key: '{key}'")

        # status check
        st = p.get("status", {})
        if st.get("value") not in ALLOWED_STATUS:
            errors.append(f"Person '{pid}' has invalid status value: '{st.get('value')}'")
        if not st.get("as_of"):
            errors.append(f"Person '{pid}' status missing 'as_of'")
        if not st.get("source_url"):
            errors.append(f"Person '{pid}' status missing 'source_url'")

        # gender check
        if p.get("gender") not in ["male", "female"]:
            errors.append(f"Person '{pid}' invalid gender: '{p.get('gender')}'")

        # tags check
        for tag in p.get("tags", []):
            if tag not in ALLOWED_TAGS:
                errors.append(f"Person '{pid}' has invalid tag: '{tag}'")

        # roles check
        for role in p.get("roles", []):
            r_org = role.get("org_id")
            if r_org not in org_ids:
                errors.append(f"Person '{pid}' role references unknown org_id: '{r_org}'")
            if not role.get("title"):
                errors.append(f"Person '{pid}' role missing 'title'")
            if not role.get("source_url"):
                errors.append(f"Person '{pid}' role missing 'source_url'")

        # family check
        for fam in p.get("family", []):
            f_rel = fam.get("relation")
            if f_rel not in ALLOWED_RELATIONS:
                errors.append(f"Person '{pid}' family relation '{f_rel}' not in allowed relations")
            f_pid = fam.get("person_id")
            if f_pid not in person_ids:
                errors.append(f"Person '{pid}' family references unknown person_id: '{f_pid}'")

        # health check
        for h in p.get("health", []):
            if h.get("confidence") not in ALLOWED_CONFIDENCE:
                errors.append(f"Person '{pid}' health has invalid confidence: '{h.get('confidence')}'")
            if not h.get("source_url"):
                errors.append(f"Person '{pid}' health claim missing source_url")

        # physical check
        phys = p.get("physical", {})
        for stat in ["height_cm", "weight_kg"]:
            s_obj = phys.get(stat)
            if s_obj is not None:
                if not isinstance(s_obj, dict):
                    errors.append(f"Person '{pid}' physical.{stat} must be object or null")
                else:
                    if s_obj.get("confidence") not in ALLOWED_CONFIDENCE:
                        errors.append(f"Person '{pid}' physical.{stat} invalid confidence: '{s_obj.get('confidence')}'")
                    if not s_obj.get("source_url"):
                        errors.append(f"Person '{pid}' physical.{stat} missing source_url")

        # sanctions check
        for s in p.get("sanctions", []):
            if s.get("list") not in ALLOWED_SANCTIONS_LISTS:
                errors.append(f"Person '{pid}' has invalid sanctions list: '{s.get('list')}'")

        # summary check
        summ = p.get("summary", "")
        if not summ or len(summ.strip()) < 20:
            errors.append(f"Person '{pid}' has inadequate summary")

    if errors:
        print(f"\n❌ VALIDATION FAILED with {len(errors)} errors:")
        for e in errors[:20]:
            print(f" - {e}")
        if len(errors) > 20:
            print(f" ... and {len(errors)-20} more errors.")
        sys.exit(1)

    print("\n✅ All referential integrity, schemas, and enums PASSED validation!")

    dataset = {
        "$schema": "./leadership.schema.json",
        "description": "Tactical entity graph of North Korean leadership and institutions for intelligence analysis, research, and policy.",
        "version": "1.0.0",
        "reviewed_as_of": "2026-10-01",
        "people": people,
        "orgs": orgs
    }

    # Determine output path
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    out_file = os.path.join(base_dir, "leadership.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {out_file}")
    print(f" - People count: {len(people)}")
    print(f" - Orgs count: {len(orgs)}")

    # Print distribution stats
    tags_count = {}
    for p in people:
        for t in p.get("tags", []):
            tags_count[t] = tags_count.get(t, 0) + 1
    print(" - Tag breakdown:")
    for t, cnt in sorted(tags_count.items(), key=lambda x: -x[1]):
        print(f"   * {t}: {cnt}")

if __name__ == "__main__":
    validate_and_build()
