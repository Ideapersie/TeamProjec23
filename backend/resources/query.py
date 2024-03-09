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

def insert_admin_user(conn):
    """
    Inserts an admin user with a hashed password into the staff table.
    
    Args:
        conn: an active psycopg2 database connection.
    """
    email = config.MY_EMAIL
    password = "teamproject23"
    hashed_password = generate_password_hash(password)
    
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Staff(email, password, admin, first_name, last_name) VALUES(%s, %s, %s, %s, %s)",
                   (email, hashed_password, True, "Super", "User"))
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

    insert_admin_user(conn)

    conn.close()

if __name__ == "__main__":
    main()
