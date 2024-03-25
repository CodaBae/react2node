const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/node-express-mongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create mongoose schemas and models
const Product = mongoose.model('Product', {
    name: String,
    price: Number,
    image: Number,
    desc: Number,


});

const Order = mongoose.model('Order', {
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: Number,
});

// Routes
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/products', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        desc: req.body.desc,

    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/orders', async (req, res) => {
    const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity,
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
