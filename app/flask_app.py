from flask import Flask, render_template, request
from pymongo import MongoClient
from datetime import datetime
import tensorflow as tf
import numpy as np
import os

from tensorflow.keras.preprocessing import image

# ==========================================
# CREATE FLASK APP
# ==========================================
app = Flask(__name__)

# ==========================================
# MONGODB CONNECTION
# ==========================================
client = MongoClient("mongodb+srv://thakkarpankti1312_db_user:<db_password>@Test12345.1iwxlsx.mongodb.net/?appName=BIRDEYE")

db = client["BirdEye"]

collection = db["predictions"]

print("✅ MongoDB Connected")

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

print("✅ Model Loaded Successfully")

# ==========================================
# LABELS
# IMPORTANT:
# PUT ALL YOUR BIRD CLASSES HERE
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
# HOME PAGE
# ==========================================
@app.route("/")
def home():
    return render_template("index.html")

# ==========================================
# PREDICTION ROUTE
# ==========================================
@app.route("/predict", methods=["POST"])
def predict():

    # Get uploaded image
    file = request.files["image"]

    # Save upload path
    upload_path = os.path.join(
        BASE_DIR,
        "app",
        "static",
        "uploads",
        file.filename
    )

    # Save image
    file.save(upload_path)

    # Load image
    img = image.load_img(upload_path, target_size=(224, 224))

    # Convert image to array
    img_array = image.img_to_array(img)

    # Normalize
    img_array = img_array / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    prediction = model.predict(img_array)

    predicted_index = np.argmax(prediction)

    predicted_label = labels[predicted_index]

    confidence = np.max(prediction) * 100

    # ==========================================
    # SAVE PREDICTION TO MONGODB
    prediction_data = {

        "bird_name": predicted_label,

        "confidence": float(confidence),

        "image_file": file.filename,

        "timestamp": datetime.now()

    }

    collection.insert_one(prediction_data)

    print("✅ Prediction Saved")

    # Return result
    return render_template(
        "index.html",
        result={
            "class": predicted_label,
            "confidence": f"{confidence:.2f}%"
        }
    )
        

# ==========================================
# RUN APP
# ==========================================
if __name__ == "__main__":
    app.run(debug=True)