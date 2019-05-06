var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "whatthefuck",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err
        else console.table(res, "\n");
        prompt();
    });
};

function prompt() {
    var rows = connection.query("SELECT count(*) FROM products", function (err, res) {
        if (err) throw err
        else return res;
    });
    inquirer
        .prompt([
            {
            name: "prodID",
            type: "input",
            message: "What is the id of the product you would like to purchase?",
            validate: function(id) {
                if (id <= rows) {
                    return true;
                    }
                return false;
                }
            },
            {
            name: "quantity",
            type: "input",
            message: "How many units of the product would you like to purchase?",
            }
        ]).then(function(answer) {
            var query = "SELECT * FROM products WHERE item_id = ? and stock_quantity >= ? ";
            connection.query(query, [answer.prodID, answer.quantity], function(err, res) {
                if (err) throw err;

                if (res.stock_quantity = null) {
                    console.log("We do not have that product in that quantity");
                }
            
                else { 
                    connection.end();
                    var newQuant = parseInt(res.stock_quantity - answer.quantity);
                    var total = res.price * answer.quantity;
                    var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";
                    
                    connection.query(query, [newQuant, answer.prodID], function (err, res) {
                        if (err) throw err;
                        console.log("Your order has been placed at a total cost of " + total);
                        });
                    }
            });
            connection.end();
        });
};

