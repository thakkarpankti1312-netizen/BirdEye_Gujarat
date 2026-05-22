import splitfolders

# Split dataset into train, validation and test
splitfolders.ratio(
    "dataset",                  # Original dataset folder
    output="processed_dataset", # Output folder
    seed=42,                    # Random split
    ratio=(0.7, 0.2, 0.1)       # Train, Validation, Test
)

print("Dataset Split Successfully!")
