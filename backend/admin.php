<?php
// backend/admin.php
require 'db.php';
handleCors();
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

if ($action === 'users') {
    if ($method === 'GET') {
        $role = $_GET['role'] ?? 'student';
        $stmt = $pdo->prepare("SELECT id, name, username, email, role, profile_image FROM users WHERE role = ?");
        $stmt->execute([$role]);
        echo json_encode($stmt->fetchAll());
    } elseif ($method === 'POST') {
        $name = $input['name'];
        $email = !empty($input['email']) ? $input['email'] : null;
        $role = $input['role'];
        $prefix = ($role === 'student') ? 'STU' : 'TCH';
        $random = rand(1000, 9999);
        $username = $prefix . $random;
        $password = password_hash('12345', PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$name, $username, $email, $password, $role]);
            echo json_encode(['success' => true, 'message' => "User created! Login ID: $username | Pass: 12345"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(['error' => 'User creation failed: ' . $e->getMessage()]);
        }
    }
} 
elseif ($action === 'subjects') {
    if ($method === 'GET') {
         // Join with users to get teacher name
        $stmt = $pdo->query("SELECT s.*, u.name as teacher_name FROM subjects s LEFT JOIN users u ON s.teacher_id = u.id");
        echo json_encode($stmt->fetchAll());
    } elseif ($method === 'POST') {
        $name = $input['name'];
        $teacher_id = $input['teacher_id'];
        $code = $input['code'] ?? strtoupper(substr($name, 0, 3) . rand(100, 999)); // Auto code
        
        $stmt = $pdo->prepare("INSERT INTO subjects (name, code, teacher_id) VALUES (?, ?, ?)");
        $stmt->execute([$name, $code, $teacher_id]);
        echo json_encode(['success' => true]);
    }
}
elseif ($action === 'teachers_list') {
    // Helper to fetch just teachers for dropdown
    $stmt = $pdo->query("SELECT id, name FROM users WHERE role = 'teacher'");
    echo json_encode($stmt->fetchAll());
}
?>
