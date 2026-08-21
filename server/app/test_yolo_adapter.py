from risk_engine.yolo_adapter import convert_yolo_detections


class MockBox:
    def __init__(self, class_id, confidence):
        self.cls = [class_id]
        self.conf = [confidence]


class MockResult:
    def __init__(self):
        self.boxes = [
            MockBox(0, 0.91),
            MockBox(1, 0.87)
        ]

        self.names = {
            0: "pothole",
            1: "alligator_crack"
        }


mock_results = [MockResult()]

detections = convert_yolo_detections(mock_results)

print("Converted YOLO detections:")
print(detections)