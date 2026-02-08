<?php
// debug_files.php
// Upload this to your 'htdocs' folder and visit http://your-site.com/debug_files.php

header('Content-Type: text/plain');

echo "Current Directory: " . __DIR__ . "\n";
echo "Listing files in current directory:\n";
$files = scandir(__DIR__);
foreach ($files as $file) {
    echo "- " . $file . "\n";
}

if (is_dir(__DIR__ . '/backend')) {
    echo "\nListing files in 'backend' folder:\n";
    $backend_files = scandir(__DIR__ . '/backend');
    foreach ($backend_files as $file) {
        echo "- " . $file . "\n";
    }
} else {
    echo "\nERROR: 'backend' folder NOT found in current directory.\n";
}
?>
