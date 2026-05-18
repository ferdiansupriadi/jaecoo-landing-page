<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');

$countFile = __DIR__ . '/count.txt';

// Session-based deduplication: count each visitor only once per session
session_start();

// Initialize count file if not exists
if (!file_exists($countFile)) {
    file_put_contents($countFile, '1000');
}

$count = (int) file_get_contents($countFile);

// Only increment if this session hasn't been counted yet
if (empty($_SESSION['counted'])) {
    $count++;
    file_put_contents($countFile, $count);
    $_SESSION['counted'] = true;
}

echo json_encode(['success' => true, 'value' => $count]);
