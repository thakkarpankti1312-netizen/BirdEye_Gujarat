from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

import tensorflow as tf
import numpy as np
import pandas as pd
import os

from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ==========================================
# CREATE APP
# ==========================================
app = Flask(__name__)
CORS(app)

# ==========================================
# BASE DIRECTORY
# ==========================================
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

# ==========================================
# LOAD MODEL
# ==========================================
model_path = os.path.join(
    BASE_DIR,
    "model",
    "bird_species_classifier.keras"
)

model = tf.keras.models.load_model(model_path)

print("✅ Model Loaded Successfully")

# ==========================================
# LOAD CSV
# ==========================================
csv_path = os.path.join(
    BASE_DIR,
    "dataset",
    "birds_info.csv"
)

bird_data = pd.read_csv(csv_path, encoding="latin1")

print("✅ CSV Loaded Successfully")

# ==========================================
# CLEAN CSV COLUMN
# ==========================================
bird_data["clean_name"] = (
    bird_data["Bird Name"]
    .astype(str)
    .str.replace("'s", "s", regex=False)
    .str.replace("_s", "s", regex=False)
    .str.replace("_", " ", regex=False)
    .str.replace("'", "", regex=False)
    .str.strip()
    .str.lower()
)

# ==========================================
# LABELS
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

        # ==================================
        # GET IMAGE
        # ==================================
        file = request.files.get("image")

        if file is None:

            return jsonify({
                "error": "No image uploaded"
            })

        # ==================================
        # PROCESS IMAGE
        # ==================================
        img = Image.open(file.stream).convert("RGB")

        img = img.resize((224, 224))

        img_array = image.img_to_array(img)

        img_array = np.expand_dims(img_array, axis=0)

        img_array = preprocess_input(img_array)

        # ==================================
        # MODEL PREDICTION
        # ==================================
        prediction = model.predict(img_array)

        predicted_index = np.argmax(prediction)

        confidence = float(np.max(prediction) * 100)

        # FIX NaN
        if np.isnan(confidence):

            confidence = 0

        predicted_label = labels[predicted_index]

        # ==================================
        # CLEAN PREDICTED LABEL
        # ==================================
        clean_name = (
            predicted_label
            .replace("_s", "'s")
            .replace("_", " ")
            .replace("'", "")
            .strip()
            .lower()
        )

        print("Predicted Bird:", clean_name)

        # ==================================
        # FIND EXACT MATCH
        # ==================================
        matched_rows = bird_data[
            bird_data["clean_name"] == clean_name
        ]

        # ==================================
        # GET BIRD INFO
        # ==================================
        if not matched_rows.empty:

            bird_info = matched_rows.iloc[0].to_dict()

            # REMOVE NaN VALUES
            for key, value in bird_info.items():

                if pd.isna(value):

                    bird_info[key] = ""

                elif isinstance(
                    value,
                    (np.integer, np.floating)
                ):

                    bird_info[key] = value.item()

        else:

            bird_info = {
                "message": "Bird information not found"
            }

        print("Prediction:", predicted_label)
        print("Confidence:", confidence)

        # ==================================
        # RETURN RESPONSE
        # ==================================
        return jsonify({

            "prediction": str(predicted_label),

            "confidence": round(
                float(confidence),
                2
            ),

            "info": bird_info

        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        })

# ==========================================
# GET BIRD INFO ROUTE
# ==========================================
@app.route("/bird-info", methods=["GET"])
def bird_info():

    try:

        name = request.args.get("name")

        clean_name = (
            name
            .replace("_s", "'s")
            .replace("_", " ")
            .replace("'", "")
            .strip()
            .lower()
        )

        data = bird_data[
            bird_data["clean_name"] == clean_name
        ]

        if data.empty:

            return jsonify({
                "error": "Bird not found"
            })

        bird_info = data.iloc[0].to_dict()

        # REMOVE NaN VALUES
        for key, value in bird_info.items():

            if pd.isna(value):

                bird_info[key] = ""

            elif isinstance(
                value,
                (np.integer, np.floating)
            ):

                bird_info[key] = value.item()

        return jsonify(bird_info)

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# ==========================================
# RUN APP
# ==========================================
if __name__ == "__main__":

    app.run(debug=True)