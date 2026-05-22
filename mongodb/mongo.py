from pymongo import MongoClient

client = MongoClient("mongodb+srv://thakkarpankti1312_db_user:Test12345@birdeye.1iwxlsx.mongodb.net/?appName=BIRDEYE")

print(client.list_database_names())