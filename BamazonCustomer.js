var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "swagdaddy420",
    database: "bamazon"
});

function start(){
    connection.connect(function (err) {
        if (err) throw err;
        run();
    });
}
start();

function run() {
    connection.query("SELECT * FROM products", function (err, results) {
        console.log(results);
        inquirer
            .prompt([
                {
                    name: "itemid",
                    type: "input",
                    message: "What is the ID of the item you would like to buy?"
                },
                {
                    name: "numberOfItems",
                    type: "input",
                    message: "how many would you like to buy?"
                }
            ]
            )
            .then(function (answer) {
                var itemid = answer.itemid;
                var quantity = parseInt(answer.numberOfItems);
                checkItemAvailable(itemid, quantity);
            })
    })
}



function checkItemAvailable(itemid, quantity) {
    connection.query("SELECT * FROM products where item_id = ?", [itemid], function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log("Item with id " + itemid + " does not exist in our database.");
        }
        else {
            if (results[0].stock_quantity < quantity) {
                console.log("Insufficient quantity!");
            }
            else {
                updateItem(itemid, results[0].stock_quantity - quantity,quantity, results[0].price);
            }
        }
        
        connection.end();
    });
}

function updateItem(itemid, quantityAfterSubtraction, quantity, price) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantityAfterSubtraction
            },
            {
                item_id: itemid
            }
        ],
        function (err, res) {
            console.log("An order has been placed. Your total is: $" + quantity * price);
            //why does this make the application hang? I cant seem to get back to the console after this.
        connection.end();
        }
    );

}
