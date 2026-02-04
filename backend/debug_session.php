<?php
// backend/debug_session.php
require 'db.php';
handleCors();
session_start();

header('Content-Type: application/json');
echo json_encode([
    'session_id' => session_id(),
    'session_data' => $_SESSION,
    'cookies' => $_COOKIE,
    'server' => $_SERVER
]);
?>
