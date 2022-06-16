import Binance from "binance-api-node";

export const getOrderBook = async () => {
    const binanceClient = Binance({
        apiKey: "JoQkY9IKmVlYGK72sFwX6SbtYcUj4P0wHK875AGqK5FphHrZrrNuM6VeogrjNUEa",
        apiSecret: "gMM1ZGermnSuZTMWE6Ze09ZXfSuFqZ87sAwsZSyTkUTHtWbpfIwlJGXwnWMzuukD"
    });

    const result = await binanceClient.book({
        symbol: "ETHBTC"
    });

    return {
        result,
    };
};