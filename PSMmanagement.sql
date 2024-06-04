-- Create the database
CREATE DATABASE PSMmanagement;

-- Use the created database
USE PSMmanagement;

-- Create the assignments table
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    set_time DATETIME NOT NULL,
    due_date DATETIME NOT NULL,
    description TEXT NOT NULL,
    remaining_time VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NULL
);

