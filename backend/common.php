<?php
// backend/common.php
require 'db.php';
handleCors();
initSession();

$user_role = $_SESSION['role'] ?? null;
// Allow read-only access to notices for everyone? Or just auth users. 
// For now, let's assume public notices or auth users.

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$pdo = getDB();

if ($action === 'notices') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM notices ORDER BY date DESC");
        echo json_encode($stmt->fetchAll());
    } elseif ($method === 'POST') {
        // Only Admin and Teacher can post
        if (!in_array($user_role, ['admin', 'teacher'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $title = $input['title'];
        $content = $input['content'];
        $target = $input['target_role'] ?? 'all';
        $date = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO notices (title, content, date, posted_by, target_role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $content, $date, $_SESSION['user_id'], $target]);
        echo json_encode(['success' => true]);
    }
} elseif ($action === 'stats') {
    // Dashboard Stats
    $stats = [];
    $stats['students'] = $pdo->query("SELECT COUNT(*) FROM users WHERE role='student'")->fetchColumn();
    $stats['teachers'] = $pdo->query("SELECT COUNT(*) FROM users WHERE role='teacher'")->fetchColumn();
    $stats['classes'] = $pdo->query("SELECT COUNT(*) FROM classes")->fetchColumn();
    
    echo json_encode($stats);
}
?>
