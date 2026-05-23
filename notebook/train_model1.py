# =========================
# IMPORT LIBRARIES
# =========================
import tensorflow as tf
import os

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping


# =========================
# DEFINE PATHS
# =========================
train_path = "processed_dataset/train"
val_path = "processed_dataset/val"


# =========================
# DATA LOADING (FIXED)
# CHANGE: used preprocess_input instead of rescale
# =========================
train_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)
val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

train_data = train_datagen.flow_from_directory(
    train_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)

val_data = val_datagen.flow_from_directory(
    val_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical'
)


# =========================
# LOAD MOBILE NET V2
# =========================
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze base model
base_model.trainable = False


# =========================
# BUILD MODEL
# =========================
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(train_data.num_classes, activation='softmax')
])


# =========================
# COMPILE MODEL
# =========================
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)


# =========================
# CALLBACK (NEW ADDITION)
# =========================
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=3,
    restore_best_weights=True
)


# =========================
# TRAIN MODEL
# =========================
history = model.fit(
    train_data,
    epochs=10,
    validation_data=val_data,
    callbacks=[early_stop]
)


# =========================
# SAVE MODEL (IMPROVED FORMAT)
# CHANGE: .h5 → .keras (recommended)
# =========================
os.makedirs("model", exist_ok=True)

model.save("model/bird_species_classifier.keras")

print("Model trained and saved successfully 🚀")
print("Saved at:", os.path.abspath("model/bird_species_classifier.keras"))