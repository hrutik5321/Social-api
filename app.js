const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
dotenv.config();

//IMPORTING ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/messages");

//CONNECTING TO BACKEND
mongoose
  .connect("mongodb://localhost/SocialApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

app.use("/images", express.static(path.join(__dirname, "public")));

//MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//ROUTES
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);
//CONNECTING SERVER
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server Running At Port ${port}`);
});
