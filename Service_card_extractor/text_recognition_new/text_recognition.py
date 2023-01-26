from .vietocr.tool.predictor import Predictor
from .vietocr.tool.config import Cfg
import cv2
import numpy as np
from PIL import Image

class TextRecognition():
    def __init__(self):
        config = Cfg.load_config_from_name('vgg_transformer')

        # config['weights'] = './weights/transformerocr.pth'
        config['weights'] = 'https://drive.google.com/uc?id=13327Y1tz1ohsm5YZMyXVMPIOjoOA0OaA'
        config['cnn']['pretrained']=False
        config['device'] = 'cpu'
        config['predictor']['beamsearch']=False

        self.detector = Predictor(config)

    def predict(self, img):
        return self.detector.predict(img)

    def predict_batch(self, img):
        return self.detector.predict_batch(img)

    def recog_text(self, img, id_boxes, name_boxes, birth_boxes, sex_boxes, national_boxes, add_boxes, home_boxes):
        #img = np.array(cv2.resize(img, (900, 600)))
        field_dict = dict()

        # crop boxes according to coordinate
        def crop_and_recog(boxes):
            crop = []
            if len(boxes) == 1:
                ymin, xmin, ymax, xmax = int(boxes[0][0]), int(boxes[0][1]), int(boxes[0][2]), int(boxes[0][3])
                crop.append(Image.fromarray(img[ymin:ymax, xmin:xmax]))
            else:
                for box in boxes:
                    ymin, xmin, ymax, xmax = int(box[0]), int(box[1]), int(box[2]), int(box[3])
                    crop.append(Image.fromarray(img[ymin:ymax, xmin:xmax]))

            return crop

        list_ans = list(crop_and_recog(id_boxes))
        list_ans.extend(crop_and_recog(name_boxes))
        list_ans.extend(crop_and_recog(birth_boxes))
        list_ans.extend(crop_and_recog(sex_boxes))
        list_ans.extend(crop_and_recog(national_boxes))
        list_ans.extend(crop_and_recog(home_boxes))
        list_ans.extend(crop_and_recog(add_boxes))

        result = self.predict_batch(list_ans)

        field_dict['id'] = result[0]
        field_dict['name'] = ' '.join(result[1:len(name_boxes) + 1])
        field_dict['birth'] = result[len(name_boxes) + 1]
        field_dict['sex'] = result[len(name_boxes) + len(birth_boxes) + 1]
        field_dict['national'] = result[len(name_boxes) + len(birth_boxes) + len(sex_boxes) + 1]
        field_dict['placeOfOrigin'] = ' '.join(result[-len(add_boxes):]) 
        field_dict['placeOfResidence'] = ' '.join(result[-len(home_boxes) - len(add_boxes) : - len(add_boxes)])
        return field_dict


