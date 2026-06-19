from flask import Flask, jsonify, request
from flask_cors import CORS
from db import cursor, db
def ensure_connection():
    global db, cursor

    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)

@app.route("/")
def home():
    return jsonify({"message": "Employee Management API Running"})


@app.route("/employees")
def get_employees():

    ensure_connection()

    cursor.execute(
        "SELECT * FROM employee"
    )

    return jsonify(cursor.fetchall())

@app.route("/employees", methods=["POST"])
def create_employee():
    ensure_connection()
    
    data = request.json

    cursor.execute("""
        INSERT INTO employee(
            pis_number,
            first_name,
            last_name,
            email,
            cadre_id,
            designation_id,
            internal_designation_id,
            group_id
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["pis_number"],
        data["first_name"],
        data["last_name"],
        data["email"],
        data["cadre_id"],
        data["designation_id"],
        data["internal_designation_id"],
        data["group_id"]
    ))

    db.commit()

    return jsonify({"message": "Employee Created"})

@app.route("/cadres")
def get_cadres():
    
    ensure_connection()
    cursor.execute("""
        SELECT *
        FROM cadre
        WHERE deleted = FALSE
    """)

    cadres = cursor.fetchall()

    return jsonify(cadres)

@app.route("/employees/<int:id>", methods=["PUT"])

def update_employee(id):
    ensure_connection()
    
    data = request.json

    cursor.execute("""
        UPDATE employee
        SET
            first_name=%s,
            last_name=%s,
            email=%s
        WHERE emp_id=%s
    """, (
        data["first_name"],
        data["last_name"],
        data["email"],
        id
    ))

    db.commit()

    return jsonify({"message": "Employee Updated"})

@app.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    ensure_connection()

    cursor.execute(
        "DELETE FROM employee WHERE emp_id=%s",
        (id,)
    )

    db.commit()

    return jsonify({"message": "Employee Deleted"})

@app.route("/cadres", methods=["POST"])
def create_cadre():
    ensure_connection()
    data = request.json

    cursor.execute(
        """
        INSERT INTO cadre(
            sname,
            full_name
        )
        VALUES(%s,%s)
        """,
        (
            data["sname"],
            data["full_name"]
        )
    )

    db.commit()

    return jsonify({
        "message": "Cadre Created"
    })
@app.route("/cadres/<int:id>", methods=["DELETE"])
def delete_cadre(id):
    ensure_connection()

    cursor.execute(
        """
        UPDATE cadre
        SET deleted = TRUE
        WHERE cadre_id=%s
        """,
        (id,)
    )

    db.commit()

    return jsonify({
        "message": "Cadre Deleted"
    })

@app.route("/designations")
def get_designations():
    ensure_connection()

    cursor.execute("""
        SELECT
            designation.designation_id,
            designation.sname,
            designation.full_name,
            cadre.full_name AS cadre_name
        FROM designation
        JOIN cadre
        ON designation.cadre_id = cadre.cadre_id
        WHERE designation.deleted = FALSE
    """)

    return jsonify(cursor.fetchall())

@app.route("/designations", methods=["POST"])
def create_designation():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO designation(
            cadre_id,
            sname,
            full_name
        )
        VALUES(%s,%s,%s)
    """, (
        data["cadre_id"],
        data["sname"],
        data["full_name"]
    ))

    db.commit()

    return jsonify({
        "message": "Designation Created"
    })

@app.route("/designations/<int:id>", methods=["DELETE"])
def delete_designation(id):
    ensure_connection()

    cursor.execute("""
        UPDATE designation
        SET deleted = TRUE
        WHERE designation_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Designation Deleted"
    })

@app.route("/groups")
def get_groups():
    ensure_connection()

    cursor.execute("""
        SELECT *
        FROM employee_group
        WHERE deleted = FALSE
    """)

    groups = cursor.fetchall()

    return jsonify(groups)

@app.route("/groups", methods=["POST"])
def create_group():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO employee_group(
            short_name,
            full_name
        )
        VALUES(%s,%s)
    """, (
        data["short_name"],
        data["full_name"]
    ))

    db.commit()

    return jsonify({
        "message": "Group Created"
    })

@app.route("/groups/<int:id>", methods=["DELETE"])
def delete_group(id):
    ensure_connection()

    cursor.execute("""
        UPDATE employee_group
        SET deleted = TRUE
        WHERE group_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Group Deleted"
    })
@app.route("/internal-designations")
def get_internal_designations():
    ensure_connection()
    cursor.execute("""
        SELECT *
        FROM internal_designation
        WHERE deleted = FALSE
    """)

    return jsonify(cursor.fetchall())
@app.route("/internal-designations", methods=["POST"])
def create_internal_designation():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO internal_designation(
            sname,
            full_name
        )
        VALUES(%s,%s)
    """, (
        data["sname"],
        data["full_name"]
    ))

    db.commit()

    return jsonify({
        "message": "Internal Designation Created"
    })
@app.route("/internal-designations/<int:id>", methods=["DELETE"])
def delete_internal_designation(id):
    ensure_connection()

    cursor.execute("""
        UPDATE internal_designation
        SET deleted = TRUE
        WHERE internal_designation_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Internal Designation Deleted"
    })

@app.route("/admins")
def get_admins():

    ensure_connection()

    cursor.execute("""
        SELECT
            admin.admin_id,
            admin.username,
            admin.user_type,
            employee.first_name,
            employee.last_name,
            employee_group.full_name AS group_name
        FROM admin
        LEFT JOIN employee
            ON admin.emp_id = employee.emp_id
        LEFT JOIN employee_group
            ON admin.group_id = employee_group.group_id
        WHERE admin.deleted = FALSE
    """)

    return jsonify(cursor.fetchall())
@app.route("/admins", methods=["POST"])
def create_admin():

    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO admin(
            emp_id,
            group_id,
            display_name,
            username,
            password,
            user_type
        )
        VALUES(%s,%s,%s,%s,%s,%s)
    """, (
        data["emp_id"],
        data["group_id"],
        data["display_name"],
        data["username"],
        data["password"],
        data["user_type"]
    ))

    db.commit()

    return jsonify({
        "message": "Admin Created"
    })
@app.route("/admins/<int:id>", methods=["DELETE"])
def delete_admin(id):

    ensure_connection()

    cursor.execute("""
        UPDATE admin
        SET deleted = TRUE
        WHERE admin_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Admin Deleted"
    })
@app.route("/adgh")
def get_adgh():

    try:
        ensure_connection()

        cursor.execute("""
            SELECT *
            FROM adgh
            WHERE deleted = FALSE
        """)

        return jsonify(cursor.fetchall())

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route("/adgh", methods=["POST"])
def create_adgh():

    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO adgh(
            emp_id,
            group_id,
            username,
            password,
            role
        )
        VALUES(%s,%s,%s,%s,%s)
    """, (
        data["emp_id"],
        data["group_id"],
        data["username"],
        data["password"],
        data["role"]
    ))

    db.commit()

    return jsonify({
        "message": "ADGH Created"
    })

if __name__ == "__main__":
    app.run(debug=True)