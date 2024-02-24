import os

from dotenv import load_dotenv
load_dotenv()

DATABASE_NAME = os.environ['DATABASE_NAME']
DATABASE_USER = os.environ['DATABASE_USER']
DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
DATABASE_HOST = os.environ['DATABASE_HOST']
MY_EMAIL = os.environ['MY_EMAIL']
