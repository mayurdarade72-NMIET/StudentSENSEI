import sqlite3

DATABASE = "studentsensei.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS student (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level INTEGER NOT NULL DEFAULT 1,
            xp INTEGER NOT NULL DEFAULT 0,
            coins INTEGER NOT NULL DEFAULT 0,
            current_world TEXT NOT NULL DEFAULT 'Village',
            completed_tasks INTEGER NOT NULL DEFAULT 0
        )
    """)

    student_exists = connection.execute(
        "SELECT id FROM student LIMIT 1"
    ).fetchone()

    if student_exists is None:
        connection.execute("""
            INSERT INTO student
            (name, level, xp, coins, current_world, completed_tasks)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("Student", 1, 0, 0, "Village", 0))

    connection.commit()
    connection.close()


def get_student():
    connection = get_connection()

    student = connection.execute(
        "SELECT * FROM student LIMIT 1"
    ).fetchone()

    connection.close()

    return student