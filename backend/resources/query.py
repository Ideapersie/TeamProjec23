"""
An application which initialises and populates the restaurant schema.

To run:
    `python query.py` or `python3 query.py`
"""
from werkzeug.security import generate_password_hash
import psycopg2
import config

def execute_sql(file_path, conn):
    """
    Executes the SQL query within a specified file.

    Args:
        file_path: the path to a file containing SQL queries.
        conn: an active psycopg2 database connection.
    """
    cursor = conn.cursor()
    
    with open(file_path, 'r') as file:
        sql = file.read()
        cursor.execute(sql)
        conn.commit()

    cursor.close()


def insert_default_users(conn):
    """
    Inserts default users with a hashed passwords into the database.
    
    Args:
        conn: an active psycopg2 database connection.
    """

    cursor = conn.cursor()

    # Admin user (with config email)
    cursor.execute("""
            INSERT INTO Staff(email, password, admin, first_name, last_name)
            VALUES(%s, %s, %s, %s, %s)
        """, (config.MY_EMAIL, generate_password_hash("admin"), True, "Super", "User"))

    # Admin user
    cursor.execute("""
        INSERT INTO Staff(email, password, admin, first_name, last_name)
        VALUES(%s, %s, %s, %s, %s)
    """, ("admin@example.com", generate_password_hash("admin"), True, "Admin", "Example"))

    # Example waiter (not admin)
    cursor.execute("""
        INSERT INTO Staff(email, password, admin, first_name, last_name, role)
        VALUES(%s, %s, %s, %s, %s, %s)
    """, ("waiter@example.com", generate_password_hash("waiter"), False, "Waiter", "Example", "Waiter"))

    # Example kitchen staff (not admin)
    cursor.execute("""
        INSERT INTO Staff(email, password, admin, first_name, last_name, role)
        VALUES(%s, %s, %s, %s, %s, %s)
    """, ("kitchen@example.com", generate_password_hash("kitchen"), False, "Kitchen", "Example", "Kitchen"))

    # Example customer
    cursor.execute("""
        INSERT INTO customer(email, password, first_name, last_name, table_number)
        VALUES(%s, %s, %s, %s, %s)
    """, ("customer@example.com", generate_password_hash("customer"), "Customer", "Example", -1))

    conn.commit()


def main():
    """
    The main entry point of this application. 
    """
    conn = psycopg2.connect(
        dbname = config.DATABASE_NAME,
        user = config.DATABASE_USER,
        password = config.DATABASE_PASSWORD,
        host= config.DATABASE_HOST)

    init_schema_path = "./init_schema.sql"
    execute_sql(init_schema_path, conn)

    populate_schema_path = "./populate_schema.sql"
    execute_sql(populate_schema_path, conn)

    insert_default_users(conn)

    conn.close()


if __name__ == "__main__":
    main()
