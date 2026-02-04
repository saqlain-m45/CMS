<?php
// backend/index.php
require 'db.php';
handleCors();

echo json_encode(["status" => "success", "message" => "CMS Backend is running!"]);
?>
