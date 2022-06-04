import axios from "axios";
import * as ccxt from "ccxt";

const binanceClient = new ccxt.binance({
  apiKey: "9rfVEhKoETfTwtPRx9trSaDrw72apblev77xwUIWzYJzYsMIT7viCvJoh24JS7Yd",
  secret: "ADMZ3MYgovyUACDZ26QKLY5S2FVyCI3xTXDfuXTTGiMXQvZlujClghKQjr7x5KRc",
  // Use the testing api
  baseURL: "https://testnet.binance.vision",
});

const config = {
  asset: "BTC",
  base: "USDT",
  allocation: 0.1, // % av portoføljen som blir satt av til hver trade
  spread: 0.2, // Midrate
  tickInterval: 2000,
};

const tick = async () => {
  const { asset, base, spread, allocation } = config;
  const market = `${asset}/${base}`;

  const orders = await binanceClient.fetchOpenOrders(market);
  for (const order of orders) {
    await binanceClient.cancelOrder(order.id);
  }

  const results = await Promise.all([
    axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    ),
    axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
    ),
  ]);
  const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;

  const sellPrice = marketPrice * (1 + spread);
  const buyPrice = marketPrice * (1 - spread);
  const balances = await binanceClient.fetchBalance();
  const assetBalance = balances.free[asset];
  const baseBalance = balances.free[base];
  const sellVolume = assetBalance * allocation;
  const buyVolume = (baseBalance * allocation) / marketPrice;

  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
  await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);

  console.log(`
        New tick for ${market}...
        Created limit sell order for ${sellVolume}@${sellPrice}
        Create limit buy order for ${buyVolume}@${buyPrice}
    `);
};

const runBot_BTC_UDST = () => {
  tick();
  // setInterval(tick, config.tickInterval);
};

export default runBot_BTC_UDST;
