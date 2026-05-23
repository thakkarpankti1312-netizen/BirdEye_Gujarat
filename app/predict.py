# ==========================================
# IMPORT LIBRARIES
# ==========================================
import tensorflow as tf
import numpy as np
import os

from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


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
# CLASS LABELS
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
# IMAGE PATH
# CHANGE IMAGE NAME HERE
# ==========================================
img_path = os.path.join(
    BASE_DIR,
    "processed_dataset",
    "test",
    "MacQueen_s Bustard",
    "MacQueen_s Bustard_12.jpg"
)


# ==========================================
# CHECK IMAGE EXISTS
# ==========================================
if not os.path.exists(img_path):
    print("❌ Image not found")
    print("Expected path:", img_path)
    exit()


# ==========================================
# LOAD IMAGE
# ==========================================
img = image.load_img(img_path, target_size=(224, 224))

img_array = image.img_to_array(img)

# Add batch dimension
img_array = np.expand_dims(img_array, axis=0)

# MobileNetV2 preprocessing
img_array = preprocess_input(img_array)


# ==========================================
# PREDICT
# ==========================================
prediction = model.predict(img_array)

predicted_index = np.argmax(prediction)

confidence = np.max(prediction) * 100

predicted_label = labels[predicted_index]


# ==========================================
# OUTPUT
# ==========================================
print("\n🐦 Prediction Result")
print("----------------------------")
print("Predicted Bird :", predicted_label)
print(f"Confidence      : {confidence:.2f}%")