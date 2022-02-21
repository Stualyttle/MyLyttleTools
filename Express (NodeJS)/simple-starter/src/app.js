import express from "express";
import * as path from "path";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/views/index.html"));
});

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`);
});
