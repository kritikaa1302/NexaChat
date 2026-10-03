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
app.use(express.json());


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