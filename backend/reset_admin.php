<?php
// backend/reset_admin.php
require 'db.php';

echo "<h2>Database Debug & Admin Reset</h2>";

try {
    $pdo = getDB();
    
    // 1. Check existing users
    echo "<h3>Existing Users:</h3>";
    $stmt = $pdo->query("SELECT id, name, username, email, role, password FROM users");
    $users = $stmt->fetchAll();
    
    if (empty($users)) {
        echo "No users found in database.<br>";
    } else {
        echo "<table border='1'><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Password Hash</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . $user['id'] . "</td>";
            echo "<td>" . $user['username'] . "</td>";
            echo "<td>" . $user['email'] . "</td>";
            echo "<td>" . $user['role'] . "</td>";
            echo "<td>" . substr($user['password'], 0, 10) . "...</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

    // 2. Force Create/Update Admin
    $password = 'admin123';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $username = 'admin';
    $email = 'admin@cms.com';

    // Check if admin exists (by username)
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin) {
        // Update existing admin
        $stmt = $pdo->prepare("UPDATE users SET password = ?, email = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $email, $admin['id']]);
        echo "<h3>Success: Admin password reset.</h3>";
    } else {
        // Create new admin
        $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['Admin User', $username, $email, $hashedPassword, 'admin']);
        echo "<h3>Success: Admin user created.</h3>";
    }

    echo "<p><strong>Credentials:</strong><br>";
    echo "Username: $username<br>";
    echo "Email: $email<br>";
    echo "Password: $password</p>";

    // Verify immediatly
    if (password_verify($password, $hashedPassword)) {
        echo "<p style='color:green'>SHA verification passed.</p>";
    } else {
        echo "<p style='color:red'>SHA verification FAILED.</p>";
    }

} catch (PDOException $e) {
    echo "<h3 style='color:red'>Database Error: " . $e->getMessage() . "</h3>";
}
?>
