const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions for key transformation
const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const transformKeys = (obj, transformFn) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => transformKeys(item, transformFn));
    const transformed = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            transformed[transformFn(key)] = transformKeys(obj[key], transformFn);
        }
    }
    return transformed;
};

// Routes
app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(transformKeys(data, toCamelCase));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/products', async (req, res) => {
    try {
        const { id, ...productData } = req.body;
        const snakeCaseData = transformKeys(productData, toSnakeCase);
        const { data, error } = await supabase
            .from('products')
            .insert([snakeCaseData])
            .select();

        if (error) throw error;
        res.status(201).json(transformKeys(data[0], toCamelCase));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { id, ...productData } = req.body;
        const snakeCaseData = transformKeys(productData, toSnakeCase);
        const { data, error } = await supabase
            .from('products')
            .update(snakeCaseData)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        res.json(transformKeys(data[0], toCamelCase));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === 'admin@example.com' && password === 'password') {
            const { data, error } = await supabase
                .from('admin_logins')
                .insert([{
                    email,
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    user_agent: req.get('User-Agent'),
                }]);

            if (error) throw error;
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/admin/logins', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('admin_logins')
            .select('*')
            .order('login_time', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = app;
