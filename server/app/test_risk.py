from risk_engine.risk_calculator import calculate_risk


scenarios = {

    "LOW RISK": {
        "detections": [
            {
                "type": "transverse_crack",
                "confidence": 0.80
            }
        ],
        "traffic_density": 0.2,
        "road_importance": 0.2,
        "pedestrian_risk": 0.1,
        "infrastructure_risk": 0.0
    },

    "MEDIUM RISK": {
        "detections": [
            {
                "type": "longitudinal_crack",
                "confidence": 0.85
            },
            {
                "type": "transverse_crack",
                "confidence": 0.82
            },
            {
                "type": "transverse_crack",
                "confidence": 0.78
            }
        ],
        "traffic_density": 0.5,
        "road_importance": 0.5,
        "pedestrian_risk": 0.4,
        "infrastructure_risk": 0.3
    },

    "HIGH RISK": {
        "detections": [
            {
                "type": "pothole",
                "confidence": 0.91
            },
            {
                "type": "alligator_crack",
                "confidence": 0.87
            }
        ],
        "traffic_density": 0.8,
        "road_importance": 0.9,
        "pedestrian_risk": 0.7,
        "infrastructure_risk": 1.0
    },

    "CRITICAL RISK": {
        "detections": [
            {
                "type": "pothole",
                "confidence": 0.96
            },
            {
                "type": "pothole",
                "confidence": 0.94
            },
            {
                "type": "alligator_crack",
                "confidence": 0.92
            },
            {
                "type": "alligator_crack",
                "confidence": 0.90
            },
            {
                "type": "pothole",
                "confidence": 0.95
            },
            {
                "type": "alligator_crack",
                "confidence": 0.91
            }
        ],
        "traffic_density": 1.0,
        "road_importance": 1.0,
        "pedestrian_risk": 1.0,
        "infrastructure_risk": 1.0
    }
}


for name, data in scenarios.items():

    result = calculate_risk(data)

    print("\n" + "=" * 50)
    print(name)
    print("=" * 50)

    print(f"Risk Score : {result['risk_score']}")
    print(f"Risk Level : {result['risk_level']}")

    print("\nBreakdown:")

    for factor, value in result["breakdown"].items():
        print(f"  {factor:<25} {value}")