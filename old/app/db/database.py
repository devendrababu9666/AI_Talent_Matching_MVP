import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "data" / "app.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


def get_connection():
    connection = sqlite3.connect(
        DB_PATH,
        check_same_thread=False,
        timeout=30,
    )

    connection.row_factory = sqlite3.Row

    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("PRAGMA busy_timeout = 30000")

    return connection


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    print("Database directory initialized.")

    with get_connection() as connection:
        connection.execute("PRAGMA journal_mode = WAL")
        schema = SCHEMA_PATH.read_text()
        connection.executescript(schema)
        connection.commit()

    print("Database initialized successfully.")