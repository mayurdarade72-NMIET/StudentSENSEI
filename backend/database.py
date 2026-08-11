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

    connection.execute("""
        CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            duration_minutes INTEGER NOT NULL,
            session_type TEXT NOT NULL DEFAULT 'pomodoro',
            xp_earned INTEGER NOT NULL DEFAULT 0,
            completed_at TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES student(id)
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS task_pool (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_text TEXT NOT NULL
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS daily_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            task_id INTEGER NOT NULL,
            task_date TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            xp_reward INTEGER NOT NULL DEFAULT 1,
            FOREIGN KEY (student_id) REFERENCES student(id),
            FOREIGN KEY (task_id) REFERENCES task_pool(id)
        )
    """)

    task_count = connection.execute(
        "SELECT COUNT(*) AS count FROM task_pool"
    ).fetchone()["count"]

    if task_count == 0:
        tasks = [
            "Review yesterday's notes",
            "Read for at least 20 minutes",
            "Solve 5 practice questions",
            "Revise one difficult concept",
            "Organize your study materials",
            "Write down today's learning goals",
            "Review important formulas or definitions",
            "Practice something you learned yesterday",
            "Summarize today's topic in your own words",
            "Clear your study desk",
            "Spend 10 minutes reviewing mistakes",
            "Plan tomorrow's study session"
        ]

        connection.executemany(
            "INSERT INTO task_pool (task_text) VALUES (?)",
            [(task,) for task in tasks]
        )

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


def add_study_session(duration_minutes, session_type, xp_earned):
    connection = get_connection()

    student = connection.execute(
        "SELECT id FROM student LIMIT 1"
    ).fetchone()

    if student is None:
        connection.close()
        return None

    connection.execute("""
        INSERT INTO study_sessions
        (student_id, duration_minutes, session_type, xp_earned, completed_at)
        VALUES (?, ?, ?, ?, datetime('now'))
    """, (
        student["id"],
        duration_minutes,
        session_type,
        xp_earned
    ))

    connection.execute("""
        UPDATE student
        SET xp = xp + ?
        WHERE id = ?
    """, (
        xp_earned,
        student["id"]
    ))

    connection.commit()
    connection.close()

    return True


def get_daily_tasks():
    connection = get_connection()

    student = connection.execute(
        "SELECT id FROM student LIMIT 1"
    ).fetchone()

    if student is None:
        connection.close()
        return None

    today = connection.execute(
        "SELECT date('now')"
    ).fetchone()[0]

    existing_tasks = connection.execute("""
        SELECT daily_tasks.*, task_pool.task_text
        FROM daily_tasks
        JOIN task_pool ON daily_tasks.task_id = task_pool.id
        WHERE daily_tasks.student_id = ?
        AND daily_tasks.task_date = ?
        ORDER BY daily_tasks.id
    """, (
        student["id"],
        today
    )).fetchall()

    if len(existing_tasks) == 0:
        connection.execute("""
            INSERT INTO daily_tasks
            (student_id, task_id, task_date, xp_reward)
            SELECT ?, id, ?, 1
            FROM task_pool
            ORDER BY RANDOM()
            LIMIT 4
        """, (
            student["id"],
            today
        ))

        connection.commit()

        existing_tasks = connection.execute("""
            SELECT daily_tasks.*, task_pool.task_text
            FROM daily_tasks
            JOIN task_pool ON daily_tasks.task_id = task_pool.id
            WHERE daily_tasks.student_id = ?
            AND daily_tasks.task_date = ?
            ORDER BY daily_tasks.id
        """, (
            student["id"],
            today
        )).fetchall()

    connection.close()

    return existing_tasks