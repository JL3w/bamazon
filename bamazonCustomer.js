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
        prompt(res);
    });
};

function prompt(inventory) {
    inquirer
        .prompt([
            {
            name: "prodID",
            type: "input",
            message: "What is the id of the product you would like to purchase?",
            },
            {
            name: "quantity",
            type: "input",
            message: "How many units of the product would you like to purchase?",
            }
        ]).then(function(answer) {
            var itemId = parseInt(answer.prodID);
            var itemQ = parseInt(answer.quantity);
            var itemArrPos = itemId -1;
            if (inventory[itemArrPos].stock_quantity >= itemQ) {
                pullTrigger(itemId, itemQ);
            }
            else {
                console.log("\nWe don't have that product in that quantity.");
                glutton();
            }
        });
}

function pullTrigger(item, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, item],
        function (err, res) {
            if (err) throw err;
            console.log("\nYour order has been placed");
            glutton();
        }
    );
}

function glutton() {
    inquirer
        .prompt([
            {
            type: "input",
            name: "restart",
            message: "Would you like to make another purchase? Press any key for yes, type 'I HATE AMERICA' to quit"
            }
        ])
        .then(function (answer) {
            if (answer.restart === "I HATE AMERICA") {
                console.log("\nShame on you!");
                process.exit(0);
            }
            else {
                start();
            }
        });
}
