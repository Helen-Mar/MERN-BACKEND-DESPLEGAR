const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Error initializing database');
    }
}

module.exports = dbConnection;