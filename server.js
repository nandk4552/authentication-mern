const express = require('express')
const mongoose = require('mongoose')
const Registeruser = require('./model')
const middleware = require('./middleware')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express();

mongoose.connect('mongodb+srv://nandk4552:Kishore007@cluster0.47oowwo.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to database");
});
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;
        let exist = await Registeruser.findOne({ email });
        if (exist) {
            return res.status(400).send({ error: "Email already exists" });
        }
        if (password != confirmpassword) {
            return res.status(400).send({ error: "Passwords not matched" });
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        });
        await newUser.save();
        res.status(200).send({ message: "User registered successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Internal server error" });
    }

})

// login page
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let exist = await Registeruser.findOne({ email });
        console.log(exist.password);
        // email doesnot exist
        if (!exist) {
            return res.status(400).send({ error: "Email not registered" });
        }
        // password doesnot match
        if (exist.password !== password) {
            return res.status(400).send({ error: "Invalid credentials" });
        }
        let payload = {
            user: {
                id: exist.id,
            }
        }
        // generate token
        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (err, token) => {
            if (err) console.log(err.message);
            return res.json({ token });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Server error" });
    }
})

// middleware jwt token
app.get('/myprofile', middleware, async (req, res) => {
    try {
        let exist = await Registeruser.findById(req.user.id);
        if (!exist) {
            return res.status(400).send({ error: "User not found" });
        }
        res.json(exist);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Server error" });
    }
})

app.listen(5000, () => {
    console.log(("Server is running on port 5000"));
})