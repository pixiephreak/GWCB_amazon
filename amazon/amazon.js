var mysql = require('mysql');
var inquirer = require('inquirer');
var products = require('./products');
var config = require('./config');
var connection = mysql.createConnection(config);

connection.connect(function(err) {
  if (err) throw err;
  console.log(`connected at ${connection.threadId}`);
});

connection.query('SELECT * from products', function(err, res) {
  if (err) throw err;
  console.log(`INVENTORY OVERVIEW:`);
  console.log(`*********************************************`);

  res.forEach(function(item) {
    console.log(`product id: ${item.item_id}`);
    console.log(`product: ${item.product_name}`);
    console.log(`department: ${item.department_name}`);
    console.log(`price: ${item.price}`);
    console.log(`inventory count: ${item.stock_count}`);
    console.log(`*********************************************`);
  });
  selectProduct();
})

//ask customer what she wants to buy
var selectProduct = function() {
  var product,
    id,
    price,
    qoh,
    order;
  inquirer.prompt({
    name: "id",
    type: "input",
    message: "Review the inventory overview above and enter the id of the item you would like to purchase?"
  }).then(function(answer) {
    var query = "SELECT product_name, price FROM products WHERE ?";
    id = answer.id;
    connection.query(query, {
      item_id: id
    }, function(err, res) {
      product = res[0].product_name;
      price = res[0].price;
      inquirer.prompt({
        name: "order",
        type: "input",
        message: `How many units of (${product}) would you like?`
      }).then(function(answer) {
        var query = "SELECT stock_count FROM products WHERE ?";
        order = answer.order;
        connection.query(query, {
          item_id: id
        }, function(err, res) {
          //quantity on hand
          qoh = res[0].stock_count;
          var newQoh = (qoh - order);
          if(order < qoh){
            var query = 'UPDATE products SET ? WHERE ?';
            connection.query(query, [{stock_count: newQoh }, {item_id: id}], function(err,res){
            console.log(`Your order total is ${price}`);
          });
          }else{
            console.log('Sorry, that item is out of stock. Please try us after our next scheduled shipment.');
          }
        });
      });
    });
  });
  clearOrder([product, id, price, qoh, order]);
};

function clearOrder([product, id, price, qoh, order]) {
  [product, id, price, qoh, order].map(function(arg){
    arg = null;
  });
};
