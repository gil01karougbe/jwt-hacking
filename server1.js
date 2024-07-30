require('dotenv').config()
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(express.json());



function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

function generateJwt({ clientName, clientEmail }){
    return jwt.sign({ clientName, clientEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

app.post('/generatetoken', (req, res) => {
    const { clientName, clientEmail } = req.body;
    if (!clientName || !clientEmail) {
        return res.status(400).json({ error: 'Client name and email are required' });
    }
    const token = generateToken();
    res.json({ token });
});

app.post('/generatejwt', (req, res) => {
    const { clientName, clientEmail } = req.body;
    if (!clientName || !clientEmail) {
        return res.status(400).json({ error: 'Client name and email are required' });
    }
    const token = generateJwt({ clientName, clientEmail });
    res.json({ token });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
