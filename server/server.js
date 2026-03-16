import express from "express";
import cors from "cors";
import "dotenv/config";
import  connectDB  from "./configs/db.js";
import userRouter from "./Routes/userRoutes.js";
import resemeRouter from "./Routes/resumeRoutes.js";
import aiRouter from "./Routes/aiRoutes.js";



const app = express();
const port = process.env.PORT || 3000;

await connectDB()

await 

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is live");
});
app.use("/api/users",userRouter)
app.use("/api/resumes",resemeRouter)
app.use("/api/ai",aiRouter)

app.listen(port, () => {
  try {
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
