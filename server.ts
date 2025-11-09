import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware to get real IP
app.use((req, res, next) => {
    (req as any).realIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const productSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: String,
    description: String,
    rating: Number,
    reviewSummary: String,
    images: [String],
    affiliateLink: String,
    status: String,
    publishDate: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const adminLoginSchema = new mongoose.Schema({
    email: String,
    loginTime: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
});

const AdminLogin = mongoose.model('AdminLogin', adminLoginSchema);

// Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products/seed', async (req, res) => {
    try {
        const products = req.body;
        await Product.insertMany(products);
        res.json({ message: 'Products seeded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Simple check, in real app use proper auth
        if (email === 'admin@example.com' && password === 'password') {
            const login = new AdminLogin({
                email,
                ip: (req as any).realIp,
                userAgent: req.get('User-Agent'),
            });
            await login.save();
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/admin/logins', async (req, res) => {
    try {
        const logins = await AdminLogin.find().sort({ loginTime: -1 });
        res.json(logins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
