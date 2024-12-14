<?php
session_start();
header('Content-Type: application/json');

// Database connection
$host = "localhost";
$dbname = "alaaladb";
$user = "postgres";
$password = "root";

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Handle checkout request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $requiredFields = ['name', 'phone', 'address', 'municipality', 'payment_mode', 'items'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            echo json_encode(["status" => "error", "message" => "Field '$field' is required."]);
            exit();
        }
    }

    try {
        // Insert order into orders table
        $stmt = $pdo->prepare("
            INSERT INTO alaala.orders (name, phone, address, municipality, payment_mode) 
            VALUES (:name, :phone, :address, :municipality, :payment_mode) 
            RETURNING id
        ");
        $stmt->execute([
            ':name' => $data['name'],
            ':phone' => $data['phone'],
            ':address' => $data['address'],
            ':municipality' => $data['municipality'],
            ':payment_mode' => $data['payment_mode'],
        ]);

        $orderId = $stmt->fetchColumn(); // Get the generated order ID

        // Insert items into order_items table
        $stmt = $pdo->prepare("
            INSERT INTO alaala.order_items (order_id, product_id, quantity, total_price) 
            VALUES (:order_id, :product_id, :quantity, :total_price)
        ");

        foreach ($data['items'] as $item) {
            $stmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['id'],
                ':quantity' => $item['quantity'],
                ':total_price' => $item['quantity'] * $item['price'],
            ]);

            // Update product stock
            $pdo->prepare("UPDATE alaala.product SET qty = qty - :quantity WHERE id = :product_id")
                ->execute([':quantity' => $item['quantity'], ':product_id' => $item['id']]);
        }

        echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error processing order: " . $e->getMessage()]);
    }
    exit();
}

echo json_encode(["status" => "error", "message" => "Invalid request method."]);
?>
