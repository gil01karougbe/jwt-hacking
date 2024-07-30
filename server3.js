require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000;
const posts = [
    {
        "id" : 1,
        "Author" : "Kyle",
        "Title" : "Why JWTs and how they work?",
        "Year" : "2020"
    },
    {
        "id" : 2,
        "Author" : "lig10",
        "Title" : "Malware Detection",
        "Year" : "2022"
    },
    {
        "id" : 3,
        "Author" : "lig10",
        "Title" : "Homorph Encryption for untrusted parties",
        "Year" : "2024"
    },
    {
        "id" : 5,
        "Author" : "Jim",
        "Title" : "APT30 Kill Chain",
        "Year" : "2022"
    }      
]
app.get('/posts', authenticateToken, (req, res) => {
    if (req.user.role === "author"){
        res.json(posts.filter(post => post.Author === req.user.name));
    }
    else {
        res.json({message: "You are a guest and guests are not allowed to view posts"});
    }
})

app.post('/login', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    //Authenticate the user by verifying his creds against the database

    const authors = posts.map(post => post.Author);
    let user;
    if (authors.includes(username)) {
        user = { name: username, role: 'author'};
    } else {
        user = { name: username, role: 'guest'};
    }
    
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});

})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.WEAK_ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })


}

app.listen(PORT)