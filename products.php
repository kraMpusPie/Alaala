<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection parameters
$host = "localhost";
$dbname = "alaaladb";
$user = "postgres";
$password = "root";

// Connect to the database
try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Error connecting to the database: " . $e->getMessage()]);
    exit();
}

// Default to guest role if user is not logged in
$role = 'guest';

// Fetch user role from the sgndb table if the user is logged in
if (!empty($_SESSION['user_id'])) {
    try {
        $stmt = $pdo->prepare("SELECT user_type FROM alaala.sgndb WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $role = in_array($user['user_type'], ['admin', 'user']) ? $user['user_type'] : 'guest';
        }
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Error fetching user role: " . $e->getMessage()]);
        exit();
    }
}

// Handle POST request to add, edit, or delete a product
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the user is an admin
    if ($role !== 'admin') {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can perform this action."]);
        exit();
    }

    // Parse the JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Invalid JSON input."]);
        exit();
    }

    // Handle different actions: add, edit, delete
    if (isset($input['action'])) {
        $action = $input['action'];

        // Add Product
        if ($action === 'addProduct') {
            $requiredFields = ['product', 'category', 'price', 'color', 'material', 'manufacturer', 'size', 'description', 'images'];
            foreach ($requiredFields as $field) {
                if (empty($input[$field])) {
                    header('Content-Type: application/json');
                    echo json_encode(["status" => "error", "message" => "Field '$field' is required."]);
                    exit();
                }
            }

            // Insert the product into the database
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO alaala.product 
                    (product, category, price, color, material, manufacturer, size, description, img) 
                    VALUES (:product, :category, :price, :color, :material, :manufacturer, :size, :description, :img)
                ");

                $stmt->execute([
                    ':product' => $input['product'],
                    ':category' => $input['category'],
                    ':price' => $input['price'],
                    ':color' => $input['color'],
                    ':material' => $input['material'],
                    ':manufacturer' => $input['manufacturer'],
                    ':size' => $input['size'],
                    ':description' => $input['description'],
                    ':img' => json_encode($input['images']), // Store images array as JSON
                ]);

                header('Content-Type: application/json');
                echo json_encode(["status" => "success", "message" => "Product added successfully."]);
                exit();
            } catch (PDOException $e) {
                header('Content-Type: application/json');
                echo json_encode(["status" => "error", "message" => "Error adding product: " . $e->getMessage()]);
                exit();
            }
        }

        // Delete Product
        if ($action === 'deleteProduct') {
            if (empty($input['id'])) {
                header('Content-Type: application/json');
                echo json_encode(["status" => "error", "message" => "Product ID is required."]);
                exit();
            }

            $productId = $input['id'];

            // Delete the product from the database
            try {
                $stmt = $pdo->prepare("DELETE FROM alaala.product WHERE id = :id");
                $stmt->execute([':id' => $productId]);

                header('Content-Type: application/json');
                echo json_encode(["status" => "success", "message" => "Product deleted successfully."]);
                exit();
            } catch (PDOException $e) {
                header('Content-Type: application/json');
                echo json_encode(["status" => "error", "message" => "Error deleting product: " . $e->getMessage()]);
                exit();
            }
        }
    }
}

// Fetch products from the product table for GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, product, category,manufacturer, color, material, size, description, price, qty, min_stock, img FROM alaala.product");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($products as &$product) {
            $product['images'] = $product['img'] ? json_decode($product['img'], true) : [];
        }

        header('Content-Type: application/json');
        echo json_encode(['products' => $products, 'role' => $role]);
        exit();
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Error fetching products: " . $e->getMessage()]);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Parse the JSON input
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input || empty($input['action'])) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Invalid action or JSON input."]);
        exit();
    }

    // Handle updateQuantity action
    if ($input['action'] === 'updateQuantity') {
        $productId = $input['productId'] ?? null;
        $quantity = $input['quantity'] ?? null;

        if (!$productId || !$quantity) {
            header('Content-Type: application/json');
            echo json_encode(["status" => "error", "message" => "Product ID and quantity are required."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("UPDATE alaala.product SET qty = :quantity WHERE id = :productId");
            $stmt->execute([
                ':quantity' => $quantity,
                ':productId' => $productId,
            ]);

            header('Content-Type: application/json');
            echo json_encode(["status" => "success", "message" => "Quantity updated successfully."]);
            exit();
        } catch (PDOException $e) {
            header('Content-Type: application/json');
            echo json_encode(["status" => "error", "message" => "Error updating quantity: " . $e->getMessage()]);
            exit();
        }
    }
}
    

// Handle unsupported HTTP methods
header('Content-Type: application/json');
echo json_encode(["error" => "Unsupported HTTP method."]);
exit();
