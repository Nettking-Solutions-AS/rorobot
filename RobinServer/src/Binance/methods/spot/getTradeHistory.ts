import Binance from "binance-api-node";

export const getTradeHistory = async () => {
    const binanceClient = Binance({
        apiKey: "JoQkY9IKmVlYGK72sFwX6SbtYcUj4P0wHK875AGqK5FphHrZrrNuM6VeogrjNUEa",
        apiSecret: "gMM1ZGermnSuZTMWE6Ze09ZXfSuFqZ87sAwsZSyTkUTHtWbpfIwlJGXwnWMzuukD"
    });

    const result = await binanceClient.tradesHistory({
        symbol: 'ETHBTC'
    });

    return {
        result,
    };
};