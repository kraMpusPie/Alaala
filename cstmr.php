<?php
session_start();

// Check if user is logged in and has 'user' role
if (!isset($_SESSION['user_email']) || $_SESSION['user_role'] != 'user') {
    // Redirect to home page if not authorized
    header("Location: index.html");
    exit();
}
?>
