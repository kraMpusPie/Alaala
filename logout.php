<?php
session_start();
session_unset();
session_destroy();
header("Location: login.html"); // Redirect to the home page after logout
exit();
?>
