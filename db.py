import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",

    database="employee_management",
    autocommit=True
)

cursor = db.cursor(dictionary=True)