const Product = require("../models/product.model");

async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getProducts(req, res) {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    let productsQuery = Product.find(query);

if (sort === "price_asc") {
  productsQuery = productsQuery.sort({ price: 1 });
}

if (sort === "price_desc") {
  productsQuery = productsQuery.sort({ price: -1 });
}

const products = await productsQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};