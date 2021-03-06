const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    ingredients: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

// productSchema.index({name: 'text'});

const Product = mongoose.model('product', productSchema);

module.exports = Product;