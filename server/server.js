// Assuming you have already installed required npm packages: express, mongoose, bcrypt, jsonwebtoken

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // For handling multipart/form-data

const cors = require('cors');
const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or if it's undefined (for non-browser requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


  
const PORT = process.env.PORT || 5000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// MongoDB setup
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const KycSchema = new mongoose.Schema({
  fileName: String,
  buffer_data: String,
  type: String
});
const Kyc = mongoose.model('Kyc', KycSchema);


const User = mongoose.model('User', userSchema);
const router = express.Router();

// Middleware
app.use(bodyParser.json());


// Route for user registration
app.post('/api/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const user = new User({
        email: email,
        password: hashedPassword
      });
  
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Route for user login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Assuming you have already set up your express app and middleware
app.get('/api/user', async (req, res) => {
  try {
    // Extract user ID from the token
    const userId = req.user.userId;
    // Retrieve user details from the database based on the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Middleware to protect routes
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Example protected route
app.get('/api/dashboard', authenticateUser, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!' });
});

// Route for handling KYC submissions
app.post('/api/kyc', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  try {
    console.log( req.files,"----------------------------")
    // Check if files were provided
    if (!req.files || !req.files.video || !req.files.image) {
      return res.status(400).json({ message: 'Both video and image files are required' });
    }

    if( req.files.video[0]){
      const kyc = Kyc({
        fileName:req.files.video[0].originalname ,
        buffer_data: req.files.video[0].buffer,
        type: "video"
      });
      
  
      await kyc.save();
      
    }
    if( req.files.image[0]){
      const kyc = Kyc({
        fileName:req.files.image[0].originalname ,
        buffer_data: req.files.image[0].buffer,
        type: "image"
      });
      
  
      await kyc.save();
      
    }

    // Access video and image files from request
    const videoFile = req.files.video[0];
    const imageFile = req.files.image[0];
 

    // Process the files as needed (e.g., save to disk, store in database, etc.)
    // For this example, we're simply logging the file metadata
    console.log('Video File:', videoFile.originalname, 'Size:', videoFile.size);
    console.log('Image File:', imageFile.originalname, 'Size:', imageFile.size);

    // Respond with a success message
    res.status(200).json({ message: 'KYC submitted successfully' });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
