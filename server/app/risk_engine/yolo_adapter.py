def convert_yolo_detections(yolo_results):
    """
    Convert YOLO detection results into the format
    expected by the Risk Engine.
    """

    detections = []

    for result in yolo_results:

        if result.boxes is None:
            continue

        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            class_name = result.names[class_id]

            detections.append({
                "type": class_name,
                "confidence": round(confidence, 4)
            })

    return detections