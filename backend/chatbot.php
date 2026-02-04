<?php
// backend/chatbot.php
require 'db.php';
handleCors();
session_start();

$pdo = getDB();
$input = json_decode(file_get_contents('php://input'), true);
$message = strtolower(trim($input['message'] ?? ''));
$userId = $_SESSION['user_id'] ?? null;
$role = $_SESSION['role'] ?? null;

$response = "I'm sorry, I didn't quite catch that. Try asking about 'teachers', 'students', 'notices', or specific subjects!";

// Logic Brain with Fuzzy Matching

// Helper to check for keywords
function contains($str, $keywords) {
    foreach ($keywords as $word) {
        if (strpos($str, $word) !== false) return true;
    }
    return false;
}

// 1. Greetings
if (contains($message, ['hi', 'hello', 'hey', 'greetings', 'start', 'begin'])) {
    $response = "Hello! I am your CMS Assistant. \nTry asking: 'How many students?', 'Who teaches Math?', or 'My attendance'.";
}

// 2. Organization / General Info ("Hows cms work", "About")
elseif (contains($message, ['how', 'work', 'about', 'what is cms', 'help', 'guide'])) {
    $response = "The College Management System (CMS) helps you track your academic progress.\n\n- **Students** can view marks, attendance, and register for courses.\n- **Teachers** can manage their classes and grading.\n- **Admins** oversee the entire institution.";
}

// 3. Statistics (Count) - Handling Typos like 'techers'
elseif (contains($message, ['student', 'pupil', 'studnets'])) {
     $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'");
     $count = $stmt->fetchColumn();
     $response = "There are currently $count registered students.";
} 
elseif (contains($message, ['teacher', 'techer', 'faculty', 'professor', 'staff'])) {
     $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'teacher'");
     $count = $stmt->fetchColumn();
     $response = "We have $count dedicated faculty members.";
} 
elseif (contains($message, ['course', 'class', 'subject', 'lesson'])) {
    if (contains($message, ['list', 'available', 'show', 'what'])) {
        // List courses
        $stmt = $pdo->query("SELECT name FROM subjects LIMIT 5");
        $courses = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $list = implode(", ", $courses);
        $response = "Here are some available courses: $list...";
    } else {
        // Count courses
        $stmt = $pdo->query("SELECT COUNT(*) FROM subjects");
        $count = $stmt->fetchColumn();
        $response = "There are $count courses available for enrollment.";
    }
}

// 4. Subject / Teacher Queries ("Who teaches Math?")
elseif (strpos($message, 'who') !== false || strpos($message, 'teach') !== false) {
    // Extract potential subject name from the message
    // Simple approach: Look for known subjects in the message
    $stmt = $pdo->query("SELECT name, teacher_id FROM subjects");
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $found = false;
    
    foreach ($subjects as $sub) {
        if (contains($message, [strtolower($sub['name'])])) {
            $tStmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
            $tStmt->execute([$sub['teacher_id']]);
            $teacher = $tStmt->fetchColumn();
            $response = "The course '{$sub['name']}' is taught by " . ($teacher ?: "an unassigned instructor") . ".";
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        $response = "I can tell you who teaches a subject. Try asking 'Who teaches [Subject Name]?'.";
    }
}

// 5. Notices
elseif (contains($message, ['notice', 'news', 'update', 'event'])) {
    $stmt = $pdo->query("SELECT title FROM notices ORDER BY date DESC LIMIT 3");
    $notices = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if ($notices) {
        $list = implode(". ", $notices);
        $response = "Latest Notices: $list.";
    } else {
        $response = "There are no recent notices posted at the moment.";
    }
}

// 6. Personal Context (Attendance/Marks)
elseif (preg_match('/(my attendance|attendance status)/', $message)) {
    if (!$userId || $role !== 'student') {
        $response = "You need to be logged in as a student to see your attendance.";
    } else {
        $stmt = $pdo->prepare("SELECT status, count(*) as count FROM attendance WHERE student_id = ? GROUP BY status");
        $stmt->execute([$userId]);
        $stats = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $present = $stats['Present'] ?? 0;
        $total = array_sum($stats);
        $percent = $total > 0 ? round(($present / $total) * 100) : 0;
        $response = "Your overall attendance is $percent%. (Present: $present days).";
    }
}

// 7. Credits
elseif (strpos($message, 'who made you') !== false) {
    $response = "I was built by the brilliant engineering team at CMS!";
}

echo json_encode(['reply' => $response]);
?>
