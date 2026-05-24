from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from difflib import get_close_matches

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

print("✅ Model Loaded")

# ==========================================
# LOAD CSV
# ==========================================
csv_path = os.path.join(
    BASE_DIR,
    "dataset",
    "birds_info.csv"
)

bird_data = pd.read_csv(
    csv_path,
    encoding="latin1"
)

print("✅ CSV Loaded")

# ==========================================
# CLEAN FUNCTION
# ==========================================
def clean_text(text):

    return (
        str(text)
        .replace("_", " ")
        .replace("'", "")
        .replace("-", " ")
        .strip()
        .lower()
    )

# ==========================================
# CLEAN CSV DATA
# ==========================================
bird_data["Bird Name"] = (
    bird_data["Bird Name"]
    .astype(str)
    .str.strip()
)

bird_data["clean_name"] = (
    bird_data["Bird Name"]
    .apply(clean_text)
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
    "Greater Flamingo",
    "Grey Hypocolius",
    "Indian Grey Hornbill",
    "Indian Peafowl",
    "Indian Skimmer",
    "MacQueen's Bustard",
    "Marshall's Iora",
    "Montagu's Harrier",
    "Painted Francolin",
    "Painted Sandgrouse",
    "Red Avadavat",
    "Sarus Crane",
    "Short-toed Snake Eagle",
    "Sociable Lapwing",
    "Stoliczka's Bushchat",
    "Sykes's Nightjar",
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

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        # ==========================
        # PREPROCESS
        # ==========================
        img_array = preprocess_input(
            img_array
        )

        # ==========================
        # MODEL PREDICTION
        # ==========================
        prediction = model.predict(
            img_array
        )

        predicted_index = np.argmax(
            prediction
        )

        confidence = float(
            np.max(prediction) * 100
        )

        # Fix NaN issue
        if np.isnan(confidence):

            confidence = 0

        predicted_label = labels[
            predicted_index
        ]

        # ==========================
        # CLEAN NAME
        # ==========================
        clean_name = clean_text(
            predicted_label
        )

        # ==========================
        # FIND CLOSEST MATCH
        # ==========================
        csv_names = bird_data[
            "clean_name"
        ].tolist()

        closest_match = get_close_matches(
            clean_name,
            csv_names,
            n=1,
            cutoff=0.5
        )

        print("===================================")
        print("Prediction:", predicted_label)
        print("Clean Name:", clean_name)
        print("Closest Match:", closest_match)

        # ==========================
        # MATCH BIRD INFO
        # ==========================
        if closest_match:

            matched_rows = bird_data[
                bird_data["clean_name"]
                == closest_match[0]
            ]

            if not matched_rows.empty:

                bird_info = (
                    matched_rows
                    .iloc[0]
                    .to_dict()
                )

                # remove helper column
                bird_info.pop(
                    "clean_name",
                    None
                )

                # convert NaN values
                for key, value in bird_info.items():

                    if pd.isna(value):

                        bird_info[key] = ""

                    else:

                        bird_info[key] = str(value)

                print("✅ Bird info found")

            else:

                bird_info = {
                    "message":
                    "Bird information not found"
                }

                print(
                    "❌ Match found but row empty"
                )

        else:

            bird_info = {
                "message":
                "Bird information not found"
            }

            print(
                "❌ No close match found"
            )

        print("===================================")

        # ==========================
        # RETURN RESPONSE
        # ==========================
        return jsonify({

            "prediction":
            predicted_label,

            "confidence":
            round(confidence, 2),

            "info":
            bird_info

        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({

            "error": str(e)

        })

# ==========================================
# GET BIRD INFO ROUTE
# ==========================================
@app.route(
    "/bird-info",
    methods=["GET"]
)
def bird_info():

    try:

        name = request.args.get(
            "name"
        )

        clean_name = clean_text(
            name
        )

        data = bird_data[
            bird_data["clean_name"]
            == clean_name
        ]

        if data.empty:

            return jsonify({

                "error":
                "Bird not found"

            })

        result = (
            data.iloc[0]
            .to_dict()
        )

        result.pop(
            "clean_name",
            None
        )

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        })

# ==========================================
# RUN APP
# ==========================================
if __name__ == "__main__":

    app.run(debug=True)