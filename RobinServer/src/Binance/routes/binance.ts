import express from "express";
import { getMarketPrice } from "../binanceConnector";
import { getLiveTradeDataFeed } from "../methods/getLiveTradeDataFeed";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send(await getLiveTradeDataFeed());
  } catch (e) {
    console.error(e);
    res.send({ error: e, code: 500 });
  }
});

export default router;
