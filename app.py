from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import date
import os
import json  # <-- Add this import
from bson import ObjectId

app = Flask(__name__)

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "finance_manager"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
expenses_collection = db['expenses']
investments_collection = db['investments']

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

app.json_encoder = JSONEncoder
# Routes
@app.route("/")
def home():
    return render_template('index.html', today=date.today().isoformat())

@app.route("/add_expense", methods=["POST"])
def add_expense():
    data = request.get_json()
    required_fields = ["category", "amount", "date"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        expense = {
            "category": data["category"],
            "amount": float(data["amount"]),
            "date": data["date"]
        }
        result = expenses_collection.insert_one(expense)
        return jsonify({"message": "Expense added", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_investment", methods=["POST"])
def add_investment():
    data = request.get_json()
    required_fields = ["stock", "buy_price", "sell_price", "quantity", "date", "tax_paid"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        investment = {
            "stock": data["stock"],
            "buy_price": float(data["buy_price"]),
            "sell_price": float(data["sell_price"]),
            "quantity": int(data["quantity"]),
            "date": data["date"],
            "tax_paid": float(data["tax_paid"])
        }
        result = investments_collection.insert_one(investment)
        return jsonify({"message": "Investment added", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/view_investment_summary")
def view_investment_summary():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$stock",
                    "total_profit_loss": {
                        "$sum": {
                            "$multiply": [
                                {"$subtract": ["$sell_price", "$buy_price"]},
                                "$quantity"
                            ]
                        }
                    },
                    "total_tax_paid": {"$sum": "$tax_paid"}
                }
            },
            {
                "$project": {
                    "stock": "$_id",
                    "profit_loss": "$total_profit_loss",
                    "total_tax": "$total_tax_paid",
                    "_id": 0
                }
            }
        ]
        
        summary = list(investments_collection.aggregate(pipeline))
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dump_expenses")
def dump_expenses():
    try:
        expenses = list(expenses_collection.find({}, {"_id": 0}))
        return jsonify(expenses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dump_investments")
def dump_investments():
    try:
        investments = list(investments_collection.find({}, {"_id": 0}))
        return jsonify(investments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/clear_expenses", methods=["POST"])
def clear_expenses():
    try:
        result = expenses_collection.delete_many({})
        return jsonify({"message": f"Deleted {result.deleted_count} expenses"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/clear_investments", methods=["POST"])
def clear_investments():
    try:
        result = investments_collection.delete_many({})
        return jsonify({"message": f"Deleted {result.deleted_count} investments"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)