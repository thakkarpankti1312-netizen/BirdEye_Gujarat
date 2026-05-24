from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

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

bird_data = pd.read_csv(csv_path, encoding="latin1")

# CLEAN COLUMN
bird_data["Bird Name"] = (
    bird_data["Bird Name"]
    .astype(str)
    .str.strip()
)

print("✅ CSV Loaded")

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
        # ==========================
        # GET IMAGE
        # ==========================
        file = request.files["image"]

        img = Image.open(file.stream).convert("RGB")
        img = img.resize((224, 224))

        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # ==========================
        # MODEL PREDICTION
        # ==========================
        prediction = model.predict(img_array)

        predicted_index = np.argmax(prediction)
        confidence = float(np.max(prediction) * 100)

        predicted_label = labels[predicted_index]

        # ==========================
        # CLEAN PREDICTED NAME
        # ==========================
        clean_name = (
            predicted_label
            .replace("_", " ")
            .replace("'", "")
            .strip()
            .lower()
        )

        # ==========================
        # FIND BIRD INFO
        # ==========================
        bird_data["clean_name"] = (
            bird_data["Bird Name"]
            .astype(str)
            .str.replace("_", " ", regex=False)
            .str.replace("'", "", regex=False)
            .str.strip()
            .str.lower()
        )

        matched_rows = pd.DataFrame()

        for word in clean_name.split():
            temp = bird_data[
                bird_data["clean_name"]
                .str.contains(word, na=False)
            ]

            if not temp.empty:
                matched_rows = temp
                break

        print("Predicted:", clean_name)
        print("CSV Names:", bird_data["clean_name"].tolist())

        # ==========================
        # GET INFO
        # ==========================
        if not matched_rows.empty:
            bird_info = matched_rows.iloc[0].to_dict()
        else:
            bird_info = {
                "message": "Bird information not found"
            }

        print("Prediction:", predicted_label)
        print("Bird Info:", bird_info)

        # ==========================
        # RETURN RESPONSE
        # ==========================
        return jsonify({
            "prediction": predicted_label,
            "confidence": round(confidence, 2),
            "info": bird_info
        })

    except Exception as e:
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

        data = bird_data[
            bird_data["Bird Name"]
            .astype(str)
            .str.replace("_", " ", regex=False)
            .str.replace("'", "", regex=False)
            .str.lower()
            ==
            name.strip()
            .replace("_", " ")
            .replace("'", "")
            .lower()
        ]

        if data.empty:
            return jsonify({
                "error": "Bird not found"
            })

        return jsonify(data.iloc[0].to_dict())

    except Exception as e:
        return jsonify({
            "error": str(e)
        })

# ==========================================
# RUN APP
# ==========================================
if __name__ == "__main__":
    app.run(debug=True)

