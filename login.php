<?php
// Start the session
session_start();

// Connect to PostgreSQL
$host = "localhost";
$dbname = "alaaladb";
$user = "postgres";  // PostgreSQL username
$password = "root";  // PostgreSQL password

// Establish connection to PostgreSQL database
$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");

if (!$conn) {
    echo "Database connection error. Please try again later.";
    exit();
}

// Handle the form submission via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data and sanitize
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Query to check if user exists and fetch the role
    $query = "SELECT * FROM alaala.sgndb WHERE email = $1";

    // Execute the query using pg_query_params to prevent SQL injection
    $result = pg_query_params($conn, $query, array($email));

    if ($result && pg_num_rows($result) > 0) {
        // Fetch user data
        $user = pg_fetch_assoc($result);

        // Verify the password using password_verify
        if (password_verify($password, $user['password'])) {
            // Store user info in session
            $_SESSION['user_id'] = $user['id'];        // Add user ID
            $_SESSION['user_email'] = $user['email'];  // Add user email
            $_SESSION['user_role'] = $user['user_type'];  // 'admin' or 'user'

            // Redirect to home page
            header("Location: index.html");
            exit();
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "No user found with that email!";
    }
}

// Close the connection to the database
pg_close($conn);
?>
