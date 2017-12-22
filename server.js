const express = require("express");
const nunjucks = require("nunjucks");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require("pg");
const pool = new Pool();

app.use(express.static("images"));
app.use(express.static("css"));

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.set("views", __dirname + "/views");
app.set("view engine", "njk");



function getCategories() {
  return fetch(
    `https://decath-product-api.herokuapp.com/categories`
  )
    .then((response) => response.json())
    .catch((error) => {console.warn(error);});
}

function searchProductsByCategory(id_category) {
  return fetch(
    `https://decath-product-api.herokuapp.com/categories/${id_category}/products`
  )
    .then((response) => response.json())
    .catch((error) => {console.warn(error);});
}

function searchProductById(id) {
  console.log("id:",id);
  return fetch(
    `https://decath-product-api.herokuapp.com/products/${id}`
  )
    .then((response) => response.json())
    .then((product) => {
      product.rating_percent = Math.round(((product.rating / 5) * 100) / 10 ) * 10;
      return product;
    })
    .catch((error) => {console.warn(error);});
}



app.get("/categories", function(request, result) {
    getCategories()
      .then((categories) => {
        result.render("categories", {
          categories : categories
        });
      })

  });

  app.get("/categories/:id/products",function(request, result) {
      const id = request.params.id;
      searchProductsByCategory(id)
      .then((products) => {
        result.render("products", {
          products : products
        });
      })
  });

  app.get("/product/:id/",function(request, result) {
      const id = request.params.id;
      searchProductById(id)
      .then((product) => {
        result.render("product", {
          product : product
        });
      })
  });




  app.listen(port, function () {
    console.log("Server listening on port:" + port);
  });
