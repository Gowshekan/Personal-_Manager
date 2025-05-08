# Personal-_Manager
# 💰 Finance Manager 🚀

A modern web application for managing personal finances, tracking expenses, and monitoring investments with MongoDB integration.

## ✨ Features

- 📝 **Expense Tracking**
  - Add expenses with categories
  - View expense history
  - Clear expense records
- 📈 **Investment Management**
  - Track stock transactions
  - Calculate profit/loss
  - Monitor tax payments
- 📊 **Dashboard & Analytics**
  - Real-time investment summary
  - Visual progress indicators
  - Performance metrics
- 🗄️ **Database Management**
  - MongoDB integration
  - Data export/import
  - One-click data clearing

## 📁 Directory Structure:
  finance_manager/
├── app.py
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js

## 🛠️ Technology Stack

- 🐍 **Python** (Backend)
- 🌐 **Flask** (Web Framework)
- 🍃 **MongoDB** (Database)
- 💄 **HTML5/CSS3** (Frontend)
- 🚀 **JavaScript** (Interactivity)

## 📦 Installation

### Prerequisites
- Python 3.9+
- MongoDB Community Edition
- pip package manager

```bash
# Clone the repository
https://github.com/Gowshekan/Personal-_Manager.git
cd finance-manager

# Install dependencies
pip install -r requirements.txt
🚀 Getting Started
Start MongoDB Service

bash
mongod --dbpath=C:\data\db
Run the Application

bash
python app.py
Access in Browser

http://localhost:5000
📋 Requirements
text
flask==3.0.0
pymongo==4.3.3
python-dotenv==1.0.0
Install all requirements with:

bash
pip install -r requirements.txt
🖥️ Usage
Add Expenses

Select category (e.g., 🏠 Rent, 🛒 Groceries)

Enter amount 💰

Choose date 📅

Track Investments

Enter stock symbol 📈 (e.g., AAPL, MSFT)

Add buy/sell prices

Track quantity and taxes

Analyze Performance

View real-time profit/loss 📊

Check investment summary

Export data to JSON

📂 Database Structure
json
// Expenses Collection
{
  "category": "Food",
  "amount": 45.50,
  "date": "2023-08-15"
}

// Investments Collection
{
  "stock": "AAPL",
  "buy_price": 150.25,
  "sell_price": 165.50,
  "quantity": 10,
  "date": "2023-08-15",
  "tax_paid": 25.00
}
🤝 Contributing
Fork the repository

Create your feature branch

Commit your changes

Push to the branch

Open a Pull Request

📄 License
MIT License © 2025 Gowshekan A V R
