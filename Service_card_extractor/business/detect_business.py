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
from absl import app, flags, logging
from absl.flags import FLAGS

sys.path.insert(0, '../yolov4_card_detection')


from model_config import text_detection_config
from card_alignment.card_alignment import CardAlignment
from text_detection.text_detection import TextDetection
from text_recognition.text_recognition import TextRecognition

from text_detection.utils.image_utils import sort_text

import cv2
import numpy as np
import json
import codecs

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
        text_detection_model = TextDetection(path_model=text_detection_config['path_to_model'],
                                                    path_labels=text_detection_config['path_to_labels'],
                                                    thres_nms=text_detection_config['nms_ths'], 
                                                    thres_score=text_detection_config['score_ths'])
        aligned_model = CardAlignment()
        text_recognition_model = TextRecognition()
        
        # detect card type
        frame = self.readImage(base64_string)

        # align card
        aligned = aligned_model.scan_card(frame)
        # detect text
        detected = np.copy(aligned)
        detection_boxes, detection_classes, category_index = text_detection_model.predict(detected)
        id_boxes, name_boxes, birth_boxes, home_boxes, add_boxes = sort_text(detection_boxes, detection_classes)

        # recognize text
        field_dict = text_recognition_model.recog_text(aligned, id_boxes, name_boxes, birth_boxes, home_boxes, add_boxes)
        return field_dict
