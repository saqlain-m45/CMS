<?php
// backend/teacher.php
require 'db.php';
handleCors();
initSession();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'teacher') {
    if ($_SESSION['role'] !== 'teacher' && $_SESSION['role'] !== 'admin') { 
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);
$teacher_id = $_SESSION['user_id'];

if ($action === 'my_subjects') {
    $stmt = $pdo->prepare("SELECT * FROM subjects WHERE teacher_id = ?");
    $stmt->execute([$teacher_id]);
    echo json_encode($stmt->fetchAll());
} 
elseif ($action === 'enrolled_students') {
    $subject_id = $_GET['subject_id'];
    // Also fetch existing marks to pre-fill
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.username 
        FROM users u 
        JOIN enrollments e ON u.id = e.student_id 
        WHERE e.subject_id = ?
    ");
    $stmt->execute([$subject_id]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch marks for this subject
    $marksStmt = $pdo->prepare("SELECT student_id, exam_type, marks_obtained FROM marks WHERE subject_id = ?");
    $marksStmt->execute([$subject_id]);
    $marksData = $marksStmt->fetchAll(PDO::FETCH_ASSOC);

    // Map marks to students
    foreach ($students as &$student) {
        $student['marks'] = [];
        foreach ($marksData as $mark) {
            if ($mark['student_id'] == $student['id']) {
                $student['marks'][$mark['exam_type']] = $mark['marks_obtained'];
            }
        }
    }

    echo json_encode($students);
}
elseif ($action === 'attendance') {
    if ($method === 'POST') {
        $subject_id = $input['subject_id'];
        $date = $input['date'];
        $records = $input['records']; 

        $pdo->beginTransaction();
        try {
            $delStmt = $pdo->prepare("DELETE FROM attendance WHERE subject_id = ? AND date = ?");
            $delStmt->execute([$subject_id, $date]);

            $stmt = $pdo->prepare("INSERT INTO attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, ?)");
            foreach ($records as $record) {
                $stmt->execute([$record['student_id'], $subject_id, $date, $record['status']]);
            }
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Failed']);
        }
    }
} elseif ($action === 'marks') {
    if ($method === 'POST') {
        $subject_id = $input['subject_id'];
        
        // records is now list of {student_id, exam_type, marks, total}
        $records = $input['records']; 

        $pdo->beginTransaction();
        try {
            // We use REPLACE OR INSERT logic or Delete/Insert specific types
            // Easiest is to delete marks for these students/types and re-insert
            
            $stmt = $pdo->prepare("INSERT OR REPLACE INTO marks (student_id, subject_id, exam_type, marks_obtained, total_marks) VALUES (?, ?, ?, ?, ?)");
            // Note: SQLite 'INSERT OR REPLACE' requires UNIQUE constraint. 
            // Better to deleting existing to appear clean.
            // But deleting all might be slow.
            // Let's assume we just want to save.
            // For this simple app, let's Delete specifically what we are updating
            
            // Actually, simpler query:
            // Check if exists, update. Else insert.
            // Or just Delete * for this subject? No, might delete other history.
            
            // Let's use delete specific tuple
            $delStmt = $pdo->prepare("DELETE FROM marks WHERE student_id = ? AND subject_id = ? AND exam_type = ?");
            
            $insStmt = $pdo->prepare("INSERT INTO marks (student_id, subject_id, exam_type, marks_obtained, total_marks) VALUES (?, ?, ?, ?, ?)");

            foreach ($records as $record) {
                $delStmt->execute([$record['student_id'], $subject_id, $record['exam_type']]);
                if ($record['marks_obtained'] !== '') { // Only insert if not empty
                    $insStmt->execute([$record['student_id'], $subject_id, $record['exam_type'], $record['marks_obtained'], $record['total_marks']]);
                }
            }
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save marks']);
        }
    }
}
?>
