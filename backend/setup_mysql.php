<?php
// backend/setup_mysql.php
require 'db.php';

echo "Setting up MySQL Database at " . DB_HOST . "...<br>";

try {
    $pdo = getDB();
} catch (Exception $e) {
    die("Could not connect to database. Please check your db_config.php credentials.<br>Error: " . $e->getMessage());
}

$queries = [
    // Users Table
    "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE, 
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'student') NOT NULL,
        profile_image VARCHAR(255)
    )",
    
    // Classes Table
    "CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        section VARCHAR(50)
    )",
    
    // Subjects Table
    "CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        class_id INT,
        teacher_id INT,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
    )",
    
    // Enrollments Table
    "CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        subject_id INT,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE(student_id, subject_id)
    )",

    // Attendance Table
    "CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        subject_id INT,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent', 'Late') NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )",

    // Marks Table
    "CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        subject_id INT,
        exam_type VARCHAR(100),
        marks_obtained DECIMAL(5,2),
        total_marks DECIMAL(5,2),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )",

    // Notices Table
    "CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        posted_by INT,
        target_role VARCHAR(50),
        FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
    )"
];

foreach ($queries as $query) {
    try {
        $pdo->exec($query);
        echo "Table created/checked successfully.<br>";
    } catch (PDOException $e) {
        echo "Error creating table: " . $e->getMessage() . "<br>";
    }
}

// Seed Admin User
try {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Admin User', 'admin', 'admin@cms.com', $password, 'admin']);
        echo "Default Admin created (admin / admin123).<br>";
    } else {
        echo "Admin usage already exists.<br>";
    }
} catch (PDOException $e) {
    echo "Error seeding admin: " . $e->getMessage() . "<br>";
}

echo "Database setup complete.";
?>
