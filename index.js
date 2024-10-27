require('dotenv').config();
const express = require('express')
const redis = require("./client")

const app = express();
const PORT = process.env.PORT || 4000;

const mockProductData = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
    { id: 3, name: 'Product C', price: 300 }
];

const mockUserData = [
    { id: 1, name: 'Harish', isActive: true },
    { id: 2, name: 'Rajeeb', isActive: false },
    { id: 3, name: 'Gokul', isActive: true }
];


redis.on("connect",()=>{
    console.log("redis connected")
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

app.post('/user/profile', async (req, res) => {
    try {
        // get cached data from Redis
        const cachedData = await redis.get('user-profile');

        if (cachedData) {
            console.log('Returning cached data');
            return res.json(JSON.parse(cachedData));
        }

        console.log('No cache found, fetching fresh data');
        const userData = mockUserData;

        // Save mock data in Redis with a TTL of 1 hour
        await redis.set('user-profile', JSON.stringify(userData), 'EX', 3600);

        res.json(userData);
    } catch (error) {
        console.error('Error in fetching user-profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/products', async (req, res) => {
    try {
        // Check if products are cached as a list in Redis
        const cachedProducts = await redis.lrange('products', 0, -1);
        console.log(cachedProducts)

        if (cachedProducts.length > 0) {
            console.log('Returning cached data from list');
            // Parse each item in the list
            const products = cachedProducts.map(product => JSON.parse(product));
            return res.json(products);
        }

        console.log('No cache found, fetching fresh data');
        const products = mockProductData;

        // Store each product as a separate item in a Redis list
        await redis.del('products'); // Clear existing list if any
        for (const product of products) {
            await redis.rpush('products', JSON.stringify(product));
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
