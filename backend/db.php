<?php
// backend/db.php

function getDB() {
    $dbPath = __DIR__ . '/db/cms.db';
    
    try {
        $pdo = new PDO("sqlite:" . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

// Helper to handle CORS
function handleCors() {
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    } else {
        // Fallback for tools/curl
        header("Access-Control-Allow-Origin: *");
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

// Robust Session Initialization
function initSession() {
    if (session_status() === PHP_SESSION_NONE) {
        // Set secure session parameters
        session_set_cookie_params([
            'lifetime' => 0, // Session cookie (lasts until browser closed)
            'path' => '/',
            'domain' => '', // Empty for localhost
            'secure' => false, // Set to true if using HTTPS
            'httponly' => true,
            'samesite' => 'Lax' // Important for cross-port localhost
        ]);
        
        // Use local session directory to avoid permission issues
        $sessionPath = __DIR__ . '/sessions';
        if (!file_exists($sessionPath)) {
            mkdir($sessionPath, 0777, true);
        }
        session_save_path($sessionPath);

        session_start();
    }
}
?>
