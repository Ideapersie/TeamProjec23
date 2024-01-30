"""
A script which initialises and populates the restaurant schema.
"""
import psycopg2

def execute_sql(file_path):
    """
    Executes the SQL query within a specified file.

    :param file_path: The path to the SQL file.
    """
    conn = psycopg2.connect(
        dbname = 'dbname', # Postgres database name
        user = 'username', # Postgres username (most likely just 'postgres')
        password = 'password', # Postgres password (possibly '' if you don't remember setting one)
        host= 'host' # 'localhost' unless you modified port then 'localhost:XXXX'
    )

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