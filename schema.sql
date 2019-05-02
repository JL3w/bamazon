CREATE DATABASE bamazon_db;
USE bamazon_db;

-- Create the table tasks.
CREATE TABLE products
(
    item_id int NOT NULL AUTO_INCREMENT,
product_name varchar(255) ,
department_name varchar(255) ,
price float,
stock_quantity float,
PRIMARY KEY (item_id)
);
