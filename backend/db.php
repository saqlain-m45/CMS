<?php
// backend/db.php

require_once 'db_config.php';

function getDB() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
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
        // Determine if we are on HTTPS (Ngrok/Production)
        $isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
        
        // Set secure session parameters
        session_set_cookie_params([
            'lifetime' => 86400, 
            'path' => '/',
            'domain' => '', 
            'secure' => true, // Must be true for SameSite=None
            'httponly' => true,
            'samesite' => 'None' // Required for Cross-Site (Vercel -> Ngrok)
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
