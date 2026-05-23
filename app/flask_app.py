from flask import Flask, request, jsonify
from flask_cors import CORS

import tensorflow as tf
import numpy as np
import pandas as pd
import os

from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)

CORS(app)

# ==========================================
# BASE DIRECTORY
# ==========================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ==========================================
# LOAD MODEL
# ==========================================
model_path = os.path.join(
    BASE_DIR,
    "model",
    "bird_species_classifier.keras"
)

model = tf.keras.models.load_model(model_path)

print("✅ Model Loaded")

# ==========================================
# LOAD CSV
# ==========================================
csv_path = os.path.join(
    BASE_DIR,
    "dataset",
    "birds_info.csv"
)

bird_data = pd.read_csv(csv_path, encoding='latin1')

print("✅ CSV Loaded")

# ==========================================
# LABELS
# IMPORTANT:
# SAME ORDER AS TRAINING
# ==========================================
labels = [
      "Asian Desert Warbler",
    "Baya Weaver",
    "Black-necked Stork",
    "Chestnut-bellied Sandgrouse",
    "Common Emerald Dove",
    "Cream-coloured Courser",
    "Crested Serpent Eagle",
    "Great Indian Bustard",
    "Greater Hoopoe-Lark",
    "Greator Flamingo",
    "Grey Hypocolius",
    "Indian Grey Hornbill",
    "Indian Peafowl",
    "Indian Skimmer",
    "MacQueen_s Bustard",
    "Marshall_s Iora",
    "Montagu_s Harrier",
    "Painted Francolin",
    "Painted Sandgrouse",
    "Red Avadavat",
    "Sarus Crane",
    "Short-toed Snake Eagle",
    "Sociable Lapwing",
    "Stoliczka_s Bushchat",
    "Sykes_s Nightjar",
    "Ultramarine Flycatcher",
    "White-naped Tit",
    "Yellow-eyed Babbler"
]
# ==========================================
# HOME ROUTE
# ==========================================
@app.route("/")
def home():

    return "BirdEye Flask App Running Successfully 🚀"

# ==========================================
# PREDICT ROUTE
# ==========================================
@app.route("/predict", methods=["POST"])
def predict():

    try:

        # GET IMAGE
        file = request.files["image"]

        # LOAD IMAGE
        img = image.load_img(file, target_size=(224, 224))

        # CONVERT TO ARRAY
        img_array = image.img_to_array(img)

        # ADD BATCH DIMENSION
        img_array = np.expand_dims(img_array, axis=0)

        # PREPROCESS
        img_array = preprocess_input(img_array)

        # PREDICT
        prediction = model.predict(img_array)

        predicted_index = np.argmax(prediction)

        confidence = float(np.max(prediction) * 100)

        predicted_label = labels[predicted_index]

        # GET CSV INFO
        bird_info = bird_data[
            bird_data["Bird Name"] == predicted_label
        ]

        # IF FOUND
        if not bird_info.empty:

            bird_info = bird_info.iloc[0]

            return jsonify({

                "prediction": predicted_label,

                "confidence": round(confidence, 2),

                "Scientific_Name": bird_info["Scientific_Name"],

                "Habitat": bird_info["Habitat"],

                "Diet": bird_info["Diet"],

                "Conservation_status":
                bird_info["Conservation_status"],

                "Category": bird_info["Category"],

                "Family": bird_info["Family"]
            })

        # DEFAULT RESPONSE
        return jsonify({

            "prediction": predicted_label,

            "confidence": round(confidence, 2)
        })

    except Exception as e:

        print(e)

        return jsonify({

            "error": str(e)
        })

# ==========================================
# RUN FLASK
# ==========================================
if __name__ == "__main__":

    app.run(debug=True)