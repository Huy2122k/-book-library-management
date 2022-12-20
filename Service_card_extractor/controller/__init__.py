from flask import Flask
from .new_id_card_controller import newIDcard
from .old_id_card_controller import oldIDcard


def create_app():
    app = Flask(__name__)
    app.register_blueprint(newIDcard)
    app.register_blueprint(oldIDcard)
    return app