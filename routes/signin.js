const express = require('express');
const admin = require('../index');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const db = require('../index');
const connectDB=require('../helpers/connectDB')

const authRouter = express.Router();

//signin
  authRouter.get('/api/test', async (req, res) => {
    try {
      await connectDB()
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = authRouter;