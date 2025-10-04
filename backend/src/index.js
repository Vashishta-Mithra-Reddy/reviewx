import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import storeRoutes from "./routes/stores.js";
import ratingRoutes from "./routes/ratings.js";
import dotenv from "dotenv";
import cors from "cors";

import sequelize from "./config/database.js";
import "./models/User.js"; 
import "./models/Store.js";
import "./models/Rating.js";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("This is the backend for Roxiler.");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/ratings", ratingRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(5000, () => {
    console.log("Database synced and backend running on port 5000");
  });
}).catch(err => {
  console.error("Unable to connect to the database:", err);
});
