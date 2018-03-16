var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "swagdaddy420",
    database: "bamazon"
});

function start() {
    connection.connect(function (err) {
        if (err) throw err;
        run();
    });
}
start();

function run() {
    inquirer
        .prompt(
            {
                name: "menu",
                type: "list",
                message: "Hello manager SwagDaddy420, What would you like to do? ",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        )
        .then(function (answer) {
            var choice = answer.menu;
            switch (choice) {
                case "View Products for Sale":
                    printAllItems();
                    break;
                case "View Low Inventory":
                    printLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewItem();
                    break;
            }
        });

}

function printAllItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        console.log(results);
    });
    connection.end();
}

function printLowInventory() {
    connection.query("SELECT * FROM products where stock_quantity < 5", function (err, results) {
        console.log(results);
    });
    connection.end();
}

function addToInventory() {
    inquirer
        .prompt([
            {
                name: "itemid",
                type: "input",
                message: "What is the id of the item you want to add inventory?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }]
        )
        .then(function (answer) {
            var itemid = answer.itemid;
            var quantity = answer.quantity;
            updateItem(itemid, quantity);

        });
}

function addNewItem() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the item you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What is the department of the item?"
            },
            {
                name: "price",
                type: "input",
                message: "How much does this item cost? "
            },
            {
                name: "quantity",
                type: "input",
                message: "How many of this item you like to add to inventory? "
            }]
        )
        .then(function (answer) {
            var name = answer.name;
            var department = answer.department;
            var itemprice = parseFloat(answer.price);
            var quantity = parseInt(answer.quantity);

            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: name,
                    department_name: department,
                    price: itemprice,
                    stock_quantity: quantity
                },
                function (err, res) {
                    console.log(quantity + " items of " + name + "(s) has been succesfully added to the database");
                    
                 connection.end();
                });

        });
}

function updateItem(itemid, quantity) {

    connection.query("SELECT * FROM products where item_id = ?", [itemid], function (err, results) {
        console.log(itemid);
        var existingQuantity = results[0].stock_quantity;
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: existingQuantity + quantity
                },
                {
                    item_id: itemid
                }
            ],
            function (err, res) {
                console.log("Item " + itemid + " has been updated");
            }
        );
        
        connection.end();
    });
}
