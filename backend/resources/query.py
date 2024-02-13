"""
A script which initialises and populates the restaurant schema.

To run:
    `python query.py` or `python3 query.py`
"""
import psycopg2
import config

def execute_sql(file_path):
    """
    Executes the SQL query within a specified file.

    Args:
        file_path: the path to a file containing SQL queries.
    """
    conn = psycopg2.connect(
        dbname = config.DATABASE_NAME,
        user = config.DATABASE_USER,
        password = config.DATABASE_PASSWORD,
        host= config.DATABASE_HOST)

    cursor = conn.cursor()
    
    with open(file_path, 'r') as file:
        sql = file.read()
        cursor.execute(sql)
        conn.commit()

    cursor.close()
    conn.close()

init_schema_path = './init_schema.sql'
populate_schema_path = './populate_schema.sql'

execute_sql(init_schema_path)
execute_sql(populate_schema_path)