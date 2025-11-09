import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Utility functions for key transformation
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const transformKeys = (obj: any, transformFn: (str: string) => string): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => transformKeys(item, transformFn));
    const transformed: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            transformed[transformFn(key)] = transformKeys(obj[key], transformFn);
        }
    }
    return transformed;
};

// Middleware to get real IP
app.use((req, res, next) => {
    (req as any).realIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    next();
});

// Initialize Supabase client
const supabaseUrl = 'https://nfztdiqibiipmdopkjos.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// PostgreSQL connection for direct database access
const pool = new Pool({
    host: 'db.nfztdiqibiipmdopkjos.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'sai@426503',
    ssl: { rejectUnauthorized: false }
});

// Routes
app.get('/api/products', async (req, res) => {
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

app.post('/api/products', async (req, res) => {
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

app.put('/api/products/:id', async (req, res) => {
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

app.delete('/api/products/:id', async (req, res) => {
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

app.post('/api/products/seed', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(req.body);

        if (error) throw error;
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
            const { data, error } = await supabase
                .from('admin_logins')
                .insert([{
                    email,
                    ip: (req as any).realIp,
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

app.get('/api/admin/logins', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
