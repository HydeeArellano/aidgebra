require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const logged = require("./middlewares/logged.middleware");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "8mb" }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());

const db =
  process.env.devmode == "true"
    ? process.env.MONGODBLOCAL
    : process.env.MONGODB;

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => console.log("connected to mongoDB : " + db));

app.get("/test", async (req, res) => {
  try {
    return res.json({ status: true, data: "Server working perfectly fine." });
  } catch (error) {
    console.log(error);
    return res.json({ status: true, error });
  }
});

app.post("/api/logout", logged, (req, res) => {
  if (req.islogged == false) {
    return res.json({ status: false, message: "Not logged in" });
  }
  res.cookie("token", "", { maxAge: 1 });

  return res.json({ status: true, message: "Logged out" });
});

app.use("/api/admin", require("./routes/admin/routes"));
app.use("/api/teacher", require("./routes/teacher/routes"));
app.use("/api/student", require("./routes/student/routes"));

server.listen(port, () => console.log(`server runs at ${port}`));
