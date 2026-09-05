const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
    try {
        console.log("AUTH MIDDLEWARE RUNNING")
        
        const authHeader = req.headers.authorization
        console.log("Auth header received:", authHeader)
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "no token provided" })
        }
        
        const token = authHeader.split(" ")[1]
        console.log("TOKEN:", token)
        
        if (!token) {
            return res.status(401).json({ message: "no token provided" })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("DECODED:", decoded)
        
        req.user = decoded.userId
        console.log("USER ID:", req.user)
        
        next()
    }
    catch (error) {
        console.log("JWT ERROR:", error.message)
        res.status(401).json({ message: "Token invalid or expired" })
    }
}

module.exports = authMiddleware