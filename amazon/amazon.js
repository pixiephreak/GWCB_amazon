var mysql = require('mysql');
var inquirer = require('inquirer');
var products = require('./products');
var config = require('./config');
var connection = mysql.createConnection(config);

connection.connect(function(err){
  if (err) throw err;
  console.log(`connected at ${connection.threadId}`);
});

//TO-DO: ASSURE THAT SCRIPT ONLY RUNS IF IT NEVER HAS BEFORE...?
//populate db
// products.forEach(function(product){
//   connection.query('INSERT INTO products SET ?', product);
// });
//print all songs in db to the terminal

connection.query('SELECT * from products', function(err, res){
  if(err) throw err;
  console.log(`INVENTORY OVERVIEW:`);
  console.log(`*********************************************`);

  res.forEach(function(item){
    console.log(`product: ${item.product_name}`);
    console.log(`department: ${item.department_name}`);
    console.log(`price: ${item.price}`);
    console.log(`inventory count: ${item.stock_count}`);
    console.log(`*********************************************`);
  });
})
