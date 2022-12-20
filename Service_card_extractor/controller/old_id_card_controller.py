from flask import Blueprint, request
from flask.wrappers import Response
from flask_cors import CORS
from flask_cors.decorator import cross_origin
from flask import jsonify
import json
from business.detect_business import DetectService

oldIDcard = Blueprint("oldIDcard", __name__)
cors = CORS(oldIDcard, resources={r"/api/*": {"origins": "*"}})

bl = DetectService()

@oldIDcard.route("/old/extract", methods=['POST'])
@cross_origin()
def extract():
    json_data = request.json
    base64_string = json_data['img']
    result = bl.main(base64_string)
    result = json.dumps(result, ensure_ascii=False)
    return Response(response=result, status=200, mimetype="application/json")
