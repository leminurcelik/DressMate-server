/* 
-signin
-signup
 */

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");    
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Provided password:', password);
        console.log('Stored password:', user.password);
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password); // Compare passwords
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ email: user.email, id: user._id },  process.env.JWT_SECRET, { expiresIn: "1h" }); // Generate token
        
        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
    }
}

const signup = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    const { email, password, name, surname } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const newUser = await User.create({
            email,
            password: password,
            name: `${name}` ,
            surname: `${surname}`
        });

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Use environment variable

        res.status(201).json({ result: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { signin, signup }; 

