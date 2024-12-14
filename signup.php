<?php
// Connect to PostgreSQL
$host = "localhost";
$dbname = "alaaladb";  // Your database name
$user = "postgres";  // PostgreSQL username (default is "postgres")
$password = "root";  // Your PostgreSQL password

$conn = pg_connect("host=localhost dbname=alaaladb user=postgres password=root");

if (!$conn) {
    die("Error in connection: " . pg_last_error());
}

// Signup logic
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $c_password = $_POST['c_password'];

    // Input validation
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        echo "Invalid email format!";
        exit;
    }

    if ($password !== $c_password) {
        echo "Passwords do not match!";
        exit;
    }

    // Check if email already exists
    $check_query = "SELECT * FROM sgndb WHERE email = $1";
    $check_result = pg_query_params($conn, $check_query, array($email));

    if (pg_num_rows($check_result) > 0) {
        echo "Email already registered!";
    } else {
        // Insert user data into the database
        $query = "INSERT INTO sgndb (email, password, date_created, user_type) VALUES ($1, $2, NOW(), 'user')";
        $insert_result = pg_query_params($conn, $query, array($email, password_hash($password, PASSWORD_DEFAULT)));

        if ($insert_result) {
            // Redirect to login page
            header("Location: login.html");
            exit();
        } else {
            echo "Error in signup: " . pg_last_error($conn);
        }
    }
}

// Close the connection
pg_close($conn);
?>