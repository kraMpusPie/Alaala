<?php
session_start();
if (isset($_SESSION['user_email']) && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
    echo '<button class="add-obituary-btn" onclick="openObituaryForm()">Add Obituary</button>';
}
?>
