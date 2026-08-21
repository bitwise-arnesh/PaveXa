SEVERITY_MAP = {
    "pothole": 0.90,
    "alligator_crack": 0.85,
    "longitudinal_crack": 0.60,
    "transverse_crack": 0.55,
    "crack": 0.60,
}


def get_damage_severity(damage_type):
    return SEVERITY_MAP.get(damage_type, 0.50)