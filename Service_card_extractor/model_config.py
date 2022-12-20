text_detection_config = {
    'path_to_model': './text_detection/config/model.tflite',
    'path_to_labels': './text_detection/config/label_map.pbtxt',
    'nms_ths': 0.2,
    'score_ths': 0.2
}

text_recognition_config = {
    'base_config': './text_recognition/config/base.yml',
    'vgg_config': './text_recognition/config/vgg-transformer.yml',
    'model_weight': './text_recognition/config/transformerocr.pth'
}

text_detection_config_new = {
    'path_to_model': './text_detection_new/config/model.tflite',
    'path_to_labels': './text_detection_new/config/label_map.pbtxt',
    'nms_ths': 0.2,
    'score_ths': 0.2
}

text_recognition_config_new = {
    'base_config': './text_recognition_new/config/base.yml',
    'vgg_config': './text_recognition_new/config/vgg-transformer.yml',
    'model_weight': './text_recognition_new/config/transformerocr.pth'
}
