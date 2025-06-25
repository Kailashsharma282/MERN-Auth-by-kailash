import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Allow only trusted origins
const allowedOrigins = [
  "https://mern-auth-by-kailash.vercel.app",
  "http://localhost:5173" // optional: for local testing
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Test route
app.get('/', (req, res) => {
  res.send("API Working fine");
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start server
app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
});
