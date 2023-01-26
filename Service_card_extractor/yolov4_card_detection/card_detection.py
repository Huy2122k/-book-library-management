import os
import re
import time
import sys
import tensorflow as tf

from .core import utils as utils
from .core.yolov4 import filter_boxes
from .core.functions import *
from tensorflow.python.saved_model import tag_constants
from PIL import Image
import cv2
import numpy as np
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
import imutils
from text_recognition_new.text_recognition import TextRecognition

def detect_card(img, FLAGS):
    config = ConfigProto()
    config.gpu_options.allow_growth = True
    session = InteractiveSession(config=config)
    STRIDES, ANCHORS, NUM_CLASS, XYSCALE = utils.load_config(FLAGS)
    input_size = FLAGS["size"]
    
    # tf framework
    saved_model_loaded = tf.saved_model.load(cfg.YOLO.BASE + FLAGS["weights"], tags=[tag_constants.SERVING])
    infer = saved_model_loaded.signatures['serving_default']

    frame = img
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image_data = cv2.resize(frame, (input_size, input_size))
    image_data = image_data / 255.
    image_data = image_data[np.newaxis, ...].astype(np.float32)
    # tf framework
    batch_data = tf.constant(image_data)
    pred_bbox = infer(batch_data)
    for key, value in pred_bbox.items():
        boxes = value[:, :, 0:4]
        pred_conf = value[:, :, 4:]

    boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
        boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
        scores=tf.reshape(
            pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
        max_output_size_per_class=50,
        max_total_size=50,
        iou_threshold=FLAGS["iou"],
        score_threshold=FLAGS["score"]
    )

    # format bounding boxes from normalized ymin, xmin, ymax, xmax ---> xmin, ymin, xmax, ymax
    original_h, original_w, _ = frame.shape
    bboxes = utils.format_boxes(boxes.numpy()[0], original_h, original_w)

    pred_bbox = [bboxes, scores.numpy()[0], classes.numpy()[0], valid_detections.numpy()[0]]

    return pred_bbox

def draw_img(frame, pred_bbox):
    # read in all class names from config
    class_names = utils.read_class_names(cfg.YOLO.CLASSES)

    # by default allow all classes in .names file
    allowed_classes = list(class_names.values())

    # draw box
    image = utils.draw_bbox(frame, pred_bbox, allowed_classes=allowed_classes)
    
    result = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    # show result
    cv2.imshow("result", result)
    cv2.waitKey(0)
        
def get_coordinates_value(pred_bbox, image):
    # read in all class names from config
    class_names = utils.read_class_names(cfg.YOLO.CLASSES)

    # by default allow all classes in .names file
    allowed_classes = list(class_names.values())

    num_classes = len(class_names)
    out_boxes, out_scores, out_classes, num_boxes = pred_bbox
    coordinatesId = []
    coordinatesFullName = []
    coordinatesDOB = []
    coordinatesSex = []
    coordinatesNatiton = []
    coordinatesHome = []
    coordinatesAdd = []

    for i in range(num_boxes):
        if int(out_classes[i]) < 0 or int(out_classes[i]) > num_classes: continue
        coor = out_boxes[i]
        class_ind = int(out_classes[i])
        class_name = class_names[class_ind]
        if class_name not in allowed_classes:
            continue
        else:
            x1 = coor[0]
            y1 = coor[1]
            x2 = coor[2]
            y2 = coor[3]
            if class_name == "id":
                coordinatesId.append([y1, x1, y2, x2])
            elif class_name == "name":
                x1 = int(coor[0] - 10)
                y1 = int(coor[1] - 5)
                x2 = int(coor[2] + 15)
                y2 = int(coor[3] + 5)
                coordinatesFullName.append([y1, x1, y2, x2])
            elif class_name == "birth":
                coordinatesDOB.append([y1, x1, y2, x2])
            elif class_name == "sex":
                coordinatesSex.append([y1, x1, y2, x2])
            elif class_name == "national":
                coordinatesNatiton.append([y1, x1, y2, x2])
            elif class_name == "home":
                x1 = int(coor[0] - 5)
                y1 = int(coor[1] - 5)
                x2 = int(coor[2] + 5)
                y2 = int(coor[3] + 5)
                coordinatesHome.append([y1, x1, y2, x2])
            elif class_name == "address":
                x1 = int(coor[0] - 5)
                y1 = int(coor[1] - 5)
                x2 = int(coor[2] + 8)
                y2 = int(coor[3] + 8)
                coordinatesAdd.append([y1, x1, y2, x2])

    def sortImg(lstXY):
        maxY = max(lstXY, key = lambda i : i[0])[0]
        minY = min(lstXY, key = lambda i : i[0])[0]
        result = []
        if (maxY - minY) < 60:
            result = sorted(lstXY, key = lambda x: x[1])
        else:
            firstRow = filter(lambda x : x[0] - minY < 60, lstXY)
            secondRow = filter(lambda x : x[0] - minY > 60, lstXY)
            firstRow = sorted(firstRow, key = lambda x: x[1])
            secondRow = sorted(secondRow, key = lambda x: x[1])
            for i in range(len(firstRow)):
                result.append(firstRow[i])
            for i in range(len(secondRow)):
                result.append(secondRow[i])

        return result

    coordinatesFullName = sortImg(coordinatesFullName)
    coordinatesHome = sortImg(coordinatesHome)
    coordinatesAdd = sortImg(coordinatesAdd)

    textRecognition = TextRecognition()
    field_dict = textRecognition.recog_text(image, coordinatesId, coordinatesFullName
                        , coordinatesDOB, coordinatesSex, coordinatesNatiton
                        , coordinatesHome, coordinatesAdd)

    return field_dict


    