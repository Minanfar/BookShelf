import express from "express";
import { connectMongoose } from "./utils/connectMongoose.js";
import router from "./routes/userRouter.js";
import cookieParser from "cookie-parser"
import cors from "cors"

const PORT = 3003;

const db=await connectMongoose();
const app = express();
app.use(express.json());
app.use( cookieParser() );
app.use( cors({
    origin: "http://localhost:5174/", 
    credentials: true 
  }) );

app.use("/", router)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
