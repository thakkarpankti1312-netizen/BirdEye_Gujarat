from pymongo import MongoClient
import pandas as pd

df = pd.read_csv("birds_info.csv")
data = df.to_dict(orient="records")

client = MongoClient(("mongodb+srv://thakkarpankti1312_db_user:birdeye.1iwxlsx.mongodb.net/?retryWrites=true&w=majority&appName=BIRDEYE"))

db = client["BirdEyeDB"]
collection = db["birds"]

collection.insert_many(data)

print("Data uploaded successfully 🚀")