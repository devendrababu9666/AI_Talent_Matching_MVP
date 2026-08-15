import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "data" / "app.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


def get_connection():
    connection = sqlite3.connect(
        DB_PATH,
        check_same_thread=False,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    print("Database directory initialized.")
    with get_connection() as connection:
        schema = SCHEMA_PATH.read_text()
        connection.executescript(schema)
    print("Database initialized successfully.")