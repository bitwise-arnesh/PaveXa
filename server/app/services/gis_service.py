import httpx
import math

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def calculate_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    R = 6371000

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return R * c


def distance_to_segment(
    point_lat: float,
    point_lon: float,
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
) -> float:
    lat_scale = 111320

    lon_scale = (
        111320
        * math.cos(math.radians(point_lat))
    )

    px = point_lon * lon_scale
    py = point_lat * lat_scale

    ax = start_lon * lon_scale
    ay = start_lat * lat_scale

    bx = end_lon * lon_scale
    by = end_lat * lat_scale

    dx = bx - ax
    dy = by - ay

    length_squared = dx * dx + dy * dy

    if length_squared == 0:
        return math.sqrt(
            (px - ax) ** 2
            + (py - ay) ** 2
        )

    t = (
        (px - ax) * dx
        + (py - ay) * dy
    ) / length_squared

    t = max(0.0, min(1.0, t))

    closest_x = ax + t * dx
    closest_y = ay + t * dy

    return math.sqrt(
        (px - closest_x) ** 2
        + (py - closest_y) ** 2
    )


def distance_to_road(
    latitude: float,
    longitude: float,
    geometry: list,
):
    if not geometry or len(geometry) < 2:
        return None

    minimum = None

    for i in range(len(geometry) - 1):
        start = geometry[i]
        end = geometry[i + 1]

        distance = distance_to_segment(
            latitude,
            longitude,
            start["lat"],
            start["lon"],
            end["lat"],
            end["lon"],
        )

        if minimum is None or distance < minimum:
            minimum = distance

    return minimum


async def get_nearby_infrastructure(
    latitude: float,
    longitude: float,
    radius: int = 500,
):
    query = f"""
    [out:json][timeout:15];

    (
        nwr["amenity"="school"]
            (around:{radius},{latitude},{longitude});

        nwr["amenity"="hospital"]
            (around:{radius},{latitude},{longitude});

        nwr["amenity"="clinic"]
            (around:{radius},{latitude},{longitude});

        nwr["amenity"="fire_station"]
            (around:{radius},{latitude},{longitude});

        nwr["amenity"="police"]
            (around:{radius},{latitude},{longitude});

        nwr["highway"="bus_stop"]
            (around:{radius},{latitude},{longitude});

        nwr["highway"="traffic_signals"]
            (around:{radius},{latitude},{longitude});

        nwr["highway"="crossing"]
            (around:{radius},{latitude},{longitude});

        nwr["railway"="station"]
            (around:{radius},{latitude},{longitude});

        nwr["railway"="halt"]
            (around:{radius},{latitude},{longitude});

        way["highway"~"primary|secondary|tertiary"]
            (around:{radius},{latitude},{longitude});
    );

    out center tags;
    """

    headers = {
        "User-Agent": (
            "PaveXa/1.0 "
            "(road-infrastructure-research-project)"
        ),
        "Referer": "https://localhost:3000/",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(
            timeout=25,
            headers=headers,
        ) as client:
            response = await client.post(
                OVERPASS_URL,
                data={"data": query},
            )

            response.raise_for_status()
            data = response.json()

    except httpx.HTTPStatusError as error:
        print("GIS / OVERPASS HTTP ERROR")
        print("Status:", error.response.status_code)
        print("Response:", error.response.text[:500])

        return {
            "available": False,
            "error": str(error),
            "radius": radius,
            "counts": {},
            "nearest": {},
            "nearby": [],
        }

    except Exception as error:
        print("GIS / OVERPASS ERROR")
        print(error)

        return {
            "available": False,
            "error": str(error),
            "radius": radius,
            "counts": {},
            "nearest": {},
            "nearby": [],
        }

    elements = data.get("elements", [])

    counts = {
        "schools": 0,
        "hospitals": 0,
        "clinics": 0,
        "fire_stations": 0,
        "police_stations": 0,
        "bus_stops": 0,
        "traffic_signals": 0,
        "railway_stations": 0,
        "crossings": 0,
        "major_roads": 0,
    }

    nearest = {
        "school": None,
        "hospital": None,
        "clinic": None,
        "fire_station": None,
        "police": None,
        "bus_stop": None,
        "traffic_signal": None,
        "railway_station": None,
        "crossing": None,
        "major_road": None,
    }

    nearby = []
    road_names = set()

    for element in elements:
        tags = element.get("tags", {})

        lat = element.get("lat")
        lon = element.get("lon")

        if lat is None or lon is None:
            center = element.get("center", {})
            lat = center.get("lat")
            lon = center.get("lon")

        if lat is None or lon is None:
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            lat,
            lon,
        )

        amenity = tags.get("amenity")
        highway = tags.get("highway")
        railway = tags.get("railway")
        name = tags.get("name")

        infrastructure_type = "other"

        if amenity == "school":
            counts["schools"] += 1
            infrastructure_type = "school"

        elif amenity == "hospital":
            counts["hospitals"] += 1
            infrastructure_type = "hospital"

        elif amenity == "clinic":
            counts["clinics"] += 1
            infrastructure_type = "clinic"

        elif amenity == "fire_station":
            counts["fire_stations"] += 1
            infrastructure_type = "fire_station"

        elif amenity == "police":
            counts["police_stations"] += 1
            infrastructure_type = "police"

        elif highway == "bus_stop":
            counts["bus_stops"] += 1
            infrastructure_type = "bus_stop"

        elif highway == "traffic_signals":
            counts["traffic_signals"] += 1
            infrastructure_type = "traffic_signal"

        elif highway == "crossing":
            counts["crossings"] += 1
            infrastructure_type = "crossing"

        elif railway in ["station", "halt"]:
            counts["railway_stations"] += 1
            infrastructure_type = "railway_station"

        elif highway in [
            "primary",
            "secondary",
            "tertiary",
        ]:
            if not name or not name.strip():
                continue

            infrastructure_type = "major_road"
            road_names.add(name.strip())

        if infrastructure_type in nearest:
            current = nearest[infrastructure_type]

            if (
                current is None
                or distance < current["distance_m"]
            ):
                nearest[infrastructure_type] = {
                    "name": name or "Unnamed",
                    "distance_m": round(distance, 2),
                    "latitude": lat,
                    "longitude": lon,
                    "osm_id": element.get("id"),
                }

        nearby.append(
            {
                "type": infrastructure_type,
                "name": name or "Unnamed",
                "distance_m": round(distance, 2),
                "latitude": lat,
                "longitude": lon,
                "osm_id": element.get("id"),
            }
        )

    counts["major_roads"] = len(road_names)

    nearby.sort(
        key=lambda item: item["distance_m"]
    )

    print("OPENSTREETMAP ANALYSIS")
    print("Location:", latitude, longitude)
    print("Radius:", radius, "meters")
    print("Infrastructure:", counts)

    return {
        "available": True,
        "radius": radius,
        "counts": counts,
        "nearest": nearest,
        "nearby": nearby,
    }