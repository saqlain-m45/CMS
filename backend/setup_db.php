<?php
// backend/setup_db.php
require 'db.php';

$pdo = getDB();

$queries = [
    // Users Table
    "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT UNIQUE, 
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'teacher', 'student')) NOT NULL,
        profile_image TEXT
    )",
    
    // Classes Table (Just for grouping if needed, but Subjects are main)
    "CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        section TEXT
    )",
    
    // Subjects Table - Added teacher_id
    "CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT,
        class_id INTEGER,
        teacher_id INTEGER,
        FOREIGN KEY (class_id) REFERENCES classes(id),
        FOREIGN KEY (teacher_id) REFERENCES users(id)
    )",
    
    // Enrollments Table - Links Student to Subject
    "CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject_id INTEGER,
        enrolled_at TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id),
        UNIQUE(student_id, subject_id)
    )",

    // Attendance Table
    "CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject_id INTEGER, -- Changed from class_id to subject_id for granularity
        date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Present', 'Absent', 'Late')) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )",

    // Marks Table
    "CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        subject_id INTEGER,
        exam_type TEXT,
        marks_obtained REAL,
        total_marks REAL,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )",

    // Notices Table
    "CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT,
        posted_by INTEGER,
        target_role TEXT,
        FOREIGN KEY (posted_by) REFERENCES users(id)
    )"
];

foreach ($queries as $query) {
    try {
        $pdo->exec($query);
    } catch (PDOException $e) {
        // Ignore table exists error
    }
}

// Seed Admin User
$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $password = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute(['Admin User', 'admin', 'admin@cms.com', $password, 'admin']);
    echo "Default Admin created.<br>";
}

echo "Database setup complete.";
?>
