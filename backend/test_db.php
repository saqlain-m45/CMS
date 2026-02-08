<?php
// backend/test_db.php
require 'db.php';

header('Content-Type: text/plain');

echo "Testing Database Connection...\n";

try {
    $pdo = getDB();
    echo "✅ Connection Successful!\n";
    
    $stmt = $pdo->query("SELECT count(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "✅ Users table exists. User count: " . $count . "\n";
    
} catch (Exception $e) {
    echo "❌ Connection Failed: " . $e->getMessage() . "\n";
}
?>
