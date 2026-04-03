const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const products = require('./products.json');

const connectDatabase = async () => {
    await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

// Import all products into DB
const importData = async () => {
    try {
        await connectDatabase();

        await Product.deleteMany();
        console.log('Products collection cleared');

        await Product.insertMany(products);
        console.log(`${products.length} products inserted`);

        process.exit(0);
    } catch (err) {
        console.error('Import failed:', err.message);
        process.exit(1);
    }
};

// Delete all data from DB
const deleteData = async () => {
    try {
        await connectDatabase();

        await Product.deleteMany();
        await Order.deleteMany();
        console.log('All collections cleared');

        process.exit(0);
    } catch (err) {
        console.error('Delete failed:', err.message);
        process.exit(1);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
} else {
    console.log('Usage:');
    console.log('  node data/seeder.js --import   (seed products into DB)');
    console.log('  node data/seeder.js --delete   (clear all DB collections)');
    process.exit(0);
}
