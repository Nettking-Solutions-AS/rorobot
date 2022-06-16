import Binance from "binance-api-node";
import axios from "axios";

const config = {
  asset: "BTC",
  base: "USDT",
  allocation: 0.1, // % av portoføljen som blir satt av til hver trade
  spread: 0.2, // Midrate
  tickInterval: 2000,
};

export const getMarketPrice = async () => {
  const binanceClient = Binance({
    apiKey: process.env["BINANCE_API_KEY"],
    apiSecret: process.env["BINANCE_API_SECRET"],
    httpBase: process.env["BINANCE_BASE_URL"],
  });
  const results = await Promise.all([
    axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    ),
    axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
    ),
  ]);
  const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;

  const sellPrice = marketPrice * (1 + config.spread);
  const buyPrice = marketPrice * (1 - config.spread);

  // Send requests to the Binance API
  const result = await binanceClient.ping();
  /*
    const result = await binanceClient.order({
        type: OrderType.LIMIT,
        symbol: 'ETHBTC',
        side: 'BUY',
        quantity: '0.1',
        price: '0.06'
    })
    */
  /*
    const result = await binanceClient.allOrders({symbol: "ETHBTC"})
    */

  return {
    marketPrice,
    sellPrice,
    buyPrice,
    binanceConnectedSuccessfully: result,
  };
};
