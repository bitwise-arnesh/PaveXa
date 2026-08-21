from risk_engine.priority import get_critical_priorities


incidents = [
    {
        "incident_id": "KOL-RD-001",
        "road_name": "EM Bypass",
        "location": "Kolkata, West Bengal",
        "damage_type": "Pothole Cluster",
        "detections": [
            {"type": "pothole", "confidence": 0.95},
            {"type": "pothole", "confidence": 0.92},
            {"type": "pothole", "confidence": 0.89},
        ],
        "traffic_density": 0.95,
        "road_importance": 0.95,
        "pedestrian_risk": 0.85,
        "infrastructure_risk": 0.90,
    },

    {
        "incident_id": "KOL-RD-002",
        "road_name": "Jessore Road",
        "location": "Dum Dum, Kolkata",
        "damage_type": "Severe Crack",
        "detections": [
            {"type": "crack", "confidence": 0.91},
            {"type": "crack", "confidence": 0.87},
            {"type": "pothole", "confidence": 0.90},
        ],
        "traffic_density": 0.95,
        "road_importance": 0.95,
        "pedestrian_risk": 0.90,
        "infrastructure_risk": 0.95,
    },

    {
        "incident_id": "KOL-RD-003",
        "road_name": "Park Street",
        "location": "Central Kolkata",
        "damage_type": "Pothole Cluster",
        "detections": [
            {"type": "pothole", "confidence": 0.93},
            {"type": "pothole", "confidence": 0.88},
            {"type": "crack", "confidence": 0.84},
        ],
        "traffic_density": 0.90,
        "road_importance": 0.90,
        "pedestrian_risk": 0.90,
        "infrastructure_risk": 0.90,
    },

    {
        "incident_id": "KOL-RD-004",
        "road_name": "A.J.C. Bose Road",
        "location": "Kolkata, West Bengal",
        "damage_type": "Road Surface Damage",
        "detections": [
            {"type": "pothole", "confidence": 0.91},
            {"type": "crack", "confidence": 0.86},
        ],
        "traffic_density": 0.88,
        "road_importance": 0.90,
        "pedestrian_risk": 0.82,
        "infrastructure_risk": 0.85,
    },

    {
        "incident_id": "KOL-RD-005",
        "road_name": "VIP Road",
        "location": "Kolkata, West Bengal",
        "damage_type": "Pothole",
        "detections": [
            {"type": "pothole", "confidence": 0.90},
            {"type": "pothole", "confidence": 0.86},
        ],
        "traffic_density": 0.85,
        "road_importance": 0.85,
        "pedestrian_risk": 0.75,
        "infrastructure_risk": 0.80,
    },

    {
        "incident_id": "KOL-RD-006",
        "road_name": "Rajarhat Main Road",
        "location": "New Town, Kolkata",
        "damage_type": "Pothole",
        "detections": [
            {"type": "pothole", "confidence": 0.89},
            {"type": "crack", "confidence": 0.83},
        ],
        "traffic_density": 0.82,
        "road_importance": 0.80,
        "pedestrian_risk": 0.70,
        "infrastructure_risk": 0.78,
    },

    {
        "incident_id": "KOL-RD-007",
        "road_name": "B.T. Road",
        "location": "Baranagar, Kolkata",
        "damage_type": "Large Pothole",
        "detections": [
            {"type": "pothole", "confidence": 0.94},
            {"type": "pothole", "confidence": 0.91},
            {"type": "crack", "confidence": 0.80},
        ],
        "traffic_density": 0.92,
        "road_importance": 0.88,
        "pedestrian_risk": 0.82,
        "infrastructure_risk": 0.86,
    },

    {
        "incident_id": "KOL-RD-008",
        "road_name": "Prince Anwar Shah Road",
        "location": "South Kolkata",
        "damage_type": "Surface Crack",
        "detections": [
            {"type": "crack", "confidence": 0.88},
            {"type": "crack", "confidence": 0.84},
        ],
        "traffic_density": 0.75,
        "road_importance": 0.78,
        "pedestrian_risk": 0.72,
        "infrastructure_risk": 0.70,
    },

    {
        "incident_id": "KOL-RD-009",
        "road_name": "Gariahat Road",
        "location": "Gariahat, Kolkata",
        "damage_type": "Moderate Pothole",
        "detections": [
            {"type": "pothole", "confidence": 0.86},
        ],
        "traffic_density": 0.70,
        "road_importance": 0.72,
        "pedestrian_risk": 0.68,
        "infrastructure_risk": 0.65,
    },

    {
        "incident_id": "KOL-RD-010",
        "road_name": "Eastern Metropolitan Bypass",
        "location": "Science City, Kolkata",
        "damage_type": "Critical Pothole Cluster",
        "detections": [
            {"type": "pothole", "confidence": 0.97},
            {"type": "pothole", "confidence": 0.94},
            {"type": "pothole", "confidence": 0.92},
            {"type": "crack", "confidence": 0.89},
        ],
        "traffic_density": 0.98,
        "road_importance": 0.98,
        "pedestrian_risk": 0.90,
        "infrastructure_risk": 0.95,
    },
]


priorities = get_critical_priorities(
    incidents,
    min_score=70,
    limit=5
)


print()
print("=" * 75)
print("PAVEXA - CRITICAL REPAIR PRIORITIES")
print("=" * 75)

print(f"Total incidents analysed : {len(incidents)}")
print(f"Priority threshold       : 70")
print(f"Maximum priorities       : 5")
print(f"Priorities returned      : {len(priorities)}")

print()
print("-" * 75)

for item in priorities:
    incident = item["incident"]

    print(
        f"Rank {item['priority_rank']} | "
        f"{incident['incident_id']} | "
        f"{incident['road_name']}"
    )

    print(f"  Location : {incident['location']}")
    print(f"  Damage   : {incident['damage_type']}")
    print(f"  Score    : {item['risk_score']}")
    print(f"  Level    : {item['risk_level']}")
    print("-" * 75)