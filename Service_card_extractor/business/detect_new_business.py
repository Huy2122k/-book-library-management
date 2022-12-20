from PIL import Image as im
import io
import base64

import os
import sys
# comment out below line to enable tensorflow outputs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
    tf.config.experimental.set_memory_growth(physical_devices[0], True)


sys.path.insert(0, '../yolov4_card_detection_new')


from model_config import text_detection_config_new
from card_alignment.card_alignment import CardAlignment
from text_detection_new.text_detection import TextDetection
from text_recognition_new.text_recognition import TextRecognition
from yolov4_card_detection.card_detection import detect_card
from text_detection_new.utils.image_utils import sort_text

from yolov4_card_detection.card_detection import draw_img
from yolov4_card_detection.card_detection import get_coordinates_value

import cv2
import numpy as np
import json
import codecs


FLAGS = {
    "weights" : '/checkpoints/yolov4-416',
    "size" : 416,
    "tiny" : False,
    "model" : "yolov4",
    "iou" : 0.5,
    "score" : 0.70
}

class DetectService:

    def __init__(self) -> None:
        pass

    def readImage(self, base64_string):
        imgdata = base64.b64decode(base64_string)
        image = im.open(io.BytesIO(imgdata))
        image = np.array(image) 
        image = image[:, :, ::-1].copy() 
        return image

    def main(self, base64_string):
        aligned_model = CardAlignment()
        
        # detect card type
        frame = self.readImage(base64_string)
        # align card
        aligned = aligned_model.scan_card(frame)
        # detect text
        detected = np.copy(aligned)
        pred_box = detect_card(detected, FLAGS)

        field_dict = get_coordinates_value(pred_box, detected)
        return field_dict
