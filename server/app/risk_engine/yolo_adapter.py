DAMAGE_TYPE_MAP = {
    # Old model classes
    "D00": "longitudinal_crack",
    "D10": "transverse_crack",
    "D20": "alligator_crack",
    "D40": "pothole",
    "D43": "pothole",

    # New PaveXa model
    "pothole": "pothole",
}


def convert_yolo_detections(yolo_results):
    """
    Convert raw YOLO results into the format
    expected by the PaveXa risk engine.
    """

    detections = []

    for result in yolo_results:

        if result.boxes is None:
            continue

        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            # Get the class name produced by the YOLO model
            raw_class = result.names[class_id]

            # Convert model class to PaveXa damage type
            damage_type = DAMAGE_TYPE_MAP.get(
                raw_class.lower(),
                "unknown"
            )

            detections.append({
                "raw_class": raw_class,
                "damage_type": damage_type,
                "type": damage_type,
                "confidence": round(confidence, 4)
            })

    return detections