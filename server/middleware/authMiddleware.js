const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async (req, res, next) => {

    try {

        // Get token from header

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });

        }


        // Format:
        // Bearer token_here

        const token = authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message: "Invalid token format"
            });

        }


        // Verify token

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Find user

        const user = await User.findById(decoded.id)
        .select("-password");


        if (!user) {

            return res.status(401).json({
                message: "User not found"
            });

        }


        // Attach user to request

        req.user = user;


        next();


    } catch(error) {


        res.status(401).json({

            message:"Unauthorized",
            error:error.message

        });

    }

};


module.exports = authMiddleware;