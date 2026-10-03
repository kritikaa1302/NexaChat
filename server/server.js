const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");


const app = express();


// Database Connection
connectDB();


// Middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Rate limiting (protects your Groq quota and login endpoint)
const rateLimit = require("express-rate-limit");

app.use("/api/chat", rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { message: "Too many requests. Please wait a minute." }
}));

app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: "Too many attempts. Try again later." }
}));


// Routes

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);


// Default Route

app.get("/", (req, res) => {

    res.json({
        message: "AI Chatbot API Running 🚀"
    });

});


// Error Handler

app.use(require("./middleware/errorMiddleware"));


// Server

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});