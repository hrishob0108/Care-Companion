const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/CareCompanion")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Hello, MongoDB with Express!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
