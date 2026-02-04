<?php
// backend/auth.php
require 'db.php';
handleCors();

initSession();

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($action === 'login') {
        $loginId = $input['email'] ?? ''; // Can be email or username
        $password = $input['password'] ?? '';

        if (!$loginId || !$password) {
            echo json_encode(['error' => 'Username/Email and password required']);
            exit;
        }

        $pdo = getDB();
        // Check both email and username
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$loginId, $loginId]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['name'] = $user['name'];
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } elseif ($action === 'logout') {
        session_destroy();
        echo json_encode(['success' => true]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'check') {
        if (isset($_SESSION['user_id'])) {
             echo json_encode([
                'authenticated' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['name'],
                    'role' => $_SESSION['role']
                ]
            ]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
    }
}
?>
