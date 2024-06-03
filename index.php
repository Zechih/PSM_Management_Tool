<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$servername = "localhost";
$username = "root";  // default XAMPP MySQL username
$password = "";  // default XAMPP MySQL password
$dbname = "PSMmanagement";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch all assignments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM assignments";
    $result = $conn->query($sql);

    $assignments = array();
    while($row = $result->fetch_assoc()) {
        $assignments[] = $row;
    }

    echo json_encode($assignments);
}

// Create new assignment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['name'];
    $set_time = $data['set_time'];
    $due_date = $data['due_date'];
    $description = $data['description'];
    $remaining_time = $data['remaining_time'];

    $sql = "INSERT INTO assignments (name, set_time, due_date, description, remaining_time)
            VALUES ('$name', '$set_time', '$due_date', '$description', '$remaining_time')";

    if ($conn->query($sql) === TRUE) {
        $data['id'] = $conn->insert_id;
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

// Update assignment
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];

    $name = $data['name'];
    $set_time = $data['set_time'];
    $due_date = $data['due_date'];
    $description = $data['description'];
    $remaining_time = $data['remaining_time'];

    $sql = "UPDATE assignments SET name='$name', set_time='$set_time', due_date='$due_date', description='$description', remaining_time='$remaining_time' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

// Delete assignment
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    
    $sql = "DELETE FROM assignments WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["id" => $id]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
}

$conn->close();


/*if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $table = $_GET['table']; // Assuming the table name is passed as a query parameter

    switch ($table) {
        case 'assignments':
            $sql = "SELECT * FROM assignments";
            break;
        case 'other_table':
            $sql = "SELECT * FROM other_table";
            break;
        // Add more cases for other tables
        default:
            // Handle invalid table name
            echo json_encode(["error" => "Invalid table name"]);
            exit();
    }

    */
