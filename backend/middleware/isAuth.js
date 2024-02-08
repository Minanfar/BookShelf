import jwt from "jsonwebtoken";
import "dotenv/config"

const JWT_SECRET = process.env.JWT_SECRET

 const isAuth= (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        console.log("Token not found");
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        const decodedPayload = jwt.verify(token, JWT_SECRET);
        req.userId = decodedPayload.userId;
        console.log(decodedPayload,"what is decodepayload")
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).send({ error: "Unauthorized" });
    }
};


export default isAuth