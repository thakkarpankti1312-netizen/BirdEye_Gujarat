#import libraries

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Dense,
    Dropout,
    Droupout,
    GlobalAveragePooling2D
)   
from tensorflow.keras.applications  import MobileNetV2

from tensorflow.keras.preprocessing.image import ImageDataGenerator


#Define path
train_path = "processed_dataset/train"
val_path = "processed_dataset/val"

#Load Dataset
train_datagen = ImageDataGenerator(rescale=1./255)
val_datagen = ImageDataGenerator(rescale=1./255)    
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

#Load MobileNetV2
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)   

#Freeze base model layers
base_model.trainable = False    

#Build model
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(train_data.num_classes, activation='softmax')
])

#Compile model
model.compile( 
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

#Train model
history = model.fit(
    train_data,
    epochs=10,
    validation_data=val_data
)

#save model
model.save("bird_species_classifier.h5")

#Run Training
print("Model trained and saved successfully! 🚀")