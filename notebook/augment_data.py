import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import (
    ImageDataGenerator,
    load_img,
    img_to_array
)

# Train folder path
train_path = "processed_dataset/train"

# Augmentation settings
datagen = ImageDataGenerator(

    rotation_range=25,

    width_shift_range=0.2,

    height_shift_range=0.2,

    zoom_range=0.2,

    horizontal_flip=True,

    fill_mode='nearest'
)

# Loop through classes
for class_name in os.listdir(train_path):

    class_path = os.path.join(train_path, class_name)

    # Skip non-folder files
    if not os.path.isdir(class_path):
        continue

    print(f"Processing: {class_name}")

    # Loop through images
    for image_name in os.listdir(class_path):

        image_path = os.path.join(class_path, image_name)

        try:

            # Load image
            img = load_img(image_path)

            # Convert image to array
            x = img_to_array(img)

            # Reshape image
            x = np.expand_dims(x, axis=0)

            # Counter
            i = 0

            # Generate augmented images
            for batch in datagen.flow(

                x,

                batch_size=1,

                save_to_dir=class_path,

                save_prefix='aug',

                save_format='jpg'
            ):

                i += 1

                # Create 3 augmented images
                if i >= 3:
                    break

        except Exception as e:

            print(f"Error processing {image_name}: {e}")

print("Data Augmentation Completed!")