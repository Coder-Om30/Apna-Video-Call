import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    const connectionDb = await mongoose.connect("mongodb+srv://ompsahu3010:2UyQoMnnim069wIS@cluster0.cpb7ps3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    server.listen(app.get("port"), () => {
        console.log("Server is running on port 8000");
    });
}

start();