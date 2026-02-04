<?php
// backend/student.php
require 'db.php';
handleCors();
initSession();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'student') {
     if ($_SESSION['role'] !== 'student' && $_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$student_id = $_SESSION['user_id']; 

if ($action === 'available_courses') {
    $stmt = $pdo->prepare("
        SELECT s.*, u.name as teacher_name 
        FROM subjects s 
        LEFT JOIN users u ON s.teacher_id = u.id
        WHERE s.id NOT IN (SELECT subject_id FROM enrollments WHERE student_id = ?)
    ");
    $stmt->execute([$student_id]);
    echo json_encode($stmt->fetchAll());
} 
elseif ($action === 'enroll') {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $subject_id = $input['subject_id'];
        $date = date('Y-m-d');
        
        try {
            $stmt = $pdo->prepare("INSERT INTO enrollments (student_id, subject_id, enrolled_at) VALUES (?, ?, ?)");
            $stmt->execute([$student_id, $subject_id, $date]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Enrollment failed']);
        }
    }
}
elseif ($action === 'my_courses') {
    $stmt = $pdo->prepare("
        SELECT s.*, u.name as teacher_name 
        FROM subjects s 
        JOIN enrollments e ON s.id = e.subject_id
        LEFT JOIN users u ON s.teacher_id = u.id
        WHERE e.student_id = ?
    ");
    $stmt->execute([$student_id]);
    echo json_encode($stmt->fetchAll());
}
elseif ($action === 'attendance') {
    // CORRECTED JOIN: joining 'subjects' instead of 'classes'
    $stmt = $pdo->prepare("
        SELECT a.*, s.name as subject_name, s.code
        FROM attendance a 
        LEFT JOIN subjects s ON a.subject_id = s.id 
        WHERE a.student_id = ? 
        ORDER BY a.date DESC
    ");
    $stmt->execute([$student_id]);
    echo json_encode($stmt->fetchAll());
} elseif ($action === 'marks') {
    $stmt = $pdo->prepare("
        SELECT m.*, s.name as subject_name 
        FROM marks m 
        JOIN subjects s ON m.subject_id = s.id 
        WHERE m.student_id = ?
    ");
    $stmt->execute([$student_id]);
    echo json_encode($stmt->fetchAll());
}
?>
