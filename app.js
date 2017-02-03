var express = require('express');
var shopifyAPI = require('shopify-node-api');

var app = express();
var Shopify = new shopifyAPI({
    shop: '2Slippers', // 2Slippers.myshopify.com
    shopify_api_key: '3cbd3480feffa02d00eb645784824176', // Your API key
    access_token: '686bfb78d7e34f823f1f3878bc308d3a' // Your API password
});

//3. create a route
app.get('/', function (req, res) {
    res.send('Shopify API test');
});

//get all customers
app.get('/customers', function (req, res) {
    //res.send('Shopify API test');
    Shopify.get('/admin/customers.json', function(err, data, headers){
        console.log(data); // Data contains product json information
        console.log(headers); // Headers returned from request
        res.json(data);
    });
});

//add new order
app.get('/new-customer', function (req, res) {
    var customer_data = {
        "customer": {
            "email": "123456789@facebook.com",
            "first_name": "bob",
            "last_name": "smith"
        }
    };

    //check if customer already exists
    Shopify.get('/admin/customers/search.json?query=email:123456789@facebook.com', function(err, data, headers){
        //res.json(data);
        if(data.customers.length <= 0) {
            //if not, add customer
            Shopify.post('/admin/customers.json', customer_data, function(err, customer, headers){
                //create a draft order with customer
                console.log(customer.id);
                var order_data = {
                    "order": {
                        "line_items": [
                            {
                                "variant_id": 447654529,
                                "quantity": 1
                            }
                        ],
                        "customer": {
                            "id": customer.id
                        },
                        "financial_status": "draft"
                    }
                };
                Shopify.post('/admin/orders.json', order_data, function(err, order, headers){
                    res.json(order);
                });
            });
        } else {
            res.send("Customer already exists!");
        }
    });
});





//start the app
app.listen(3000, function () {
    console.log('listening on port 3000!')
});