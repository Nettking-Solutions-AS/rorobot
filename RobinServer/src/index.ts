import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import binance from "./routes/binance";

dotenv.config();

const app = express();
const port = 8080; // default port to listen

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", binance);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
