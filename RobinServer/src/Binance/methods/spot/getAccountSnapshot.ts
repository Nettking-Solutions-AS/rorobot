import Binance from "binance-api-node";

export const getAccountSnapshot = async () => {
    const binanceClient = Binance({
        apiKey: "JoQkY9IKmVlYGK72sFwX6SbtYcUj4P0wHK875AGqK5FphHrZrrNuM6VeogrjNUEa",
        apiSecret: "gMM1ZGermnSuZTMWE6Ze09ZXfSuFqZ87sAwsZSyTkUTHtWbpfIwlJGXwnWMzuukD"
    });

    const result = await binanceClient.accountSnapshot({
        "type": "SPOT"
    });

    return {
        result,
    };
};

// Schedule job every 24 hours
export const Snapshot24HInterval = setInterval(getAccountSnapshot, 1000 * 60 * 60 * 24);
