import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";

import connectToDb from "./config/Db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

// root dir
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/search", searchRoutes);

if (process.env.NODE_ENV === "production") {
  //this is backend
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  //this is frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  connectToDb();
  console.log(`The server started at the port:`, port);
});
