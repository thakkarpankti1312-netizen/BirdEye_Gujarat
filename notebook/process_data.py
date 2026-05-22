import os
from PIL import Image

# Original dataset path
dataset_path = "dataset"

# Desired image size
IMAGE_SIZE = (224, 224)

# Loop through each class folder
for class_name in os.listdir(dataset_path):

    class_path = os.path.join(dataset_path, class_name)

    # Skip non-folder files
    if not os.path.isdir(class_path):
        continue

    print(f"Processing class: {class_name}")

    # Loop through images
    for image_name in os.listdir(class_path):

        image_path = os.path.join(class_path, image_name)

        try:
            # Open image
            img = Image.open(image_path)

            # Convert image to RGB
            img = img.convert("RGB")

            # Resize image
            img = img.resize(IMAGE_SIZE)

            # Save cleaned image
            img.save(image_path)

        except Exception as e:

            print(f"Error in {image_name}: {e}")

print("Preprocessing Completed!")