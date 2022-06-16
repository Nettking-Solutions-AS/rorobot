import Binance from "binance-api-node";

export const getCandlestick = async () => {
    const binanceClient = Binance({
        apiKey: "JoQkY9IKmVlYGK72sFwX6SbtYcUj4P0wHK875AGqK5FphHrZrrNuM6VeogrjNUEa",
        apiSecret: "gMM1ZGermnSuZTMWE6Ze09ZXfSuFqZ87sAwsZSyTkUTHtWbpfIwlJGXwnWMzuukD"
    });

    const oneMinute = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "1m"
    });

    const ThreeMinutes = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "3m"
    });

    const fiveMinutes = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "5m"
    });

    const fiftheenMinuntes = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "15m"
    });

    const thirtyMinutes = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "30m"
    });

    const oneHour = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "1h"
    });

    const twoHours = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "2h"
    });

    const fourHours = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "4h"
    });

    const sixHours = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "6h"
    });

    const eightHours = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "8h"
    });

    const twelveHours = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "12h"
    });

    const oneDay = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "1d"
    });

    const threeDays = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "3d"
    });

    const oneWeek = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "1w"
    });

    const oneMonth = await binanceClient.candles({
        symbol: "BTCETH",
        interval: "1M"
    });

    return {
        oneMinute,
        ThreeMinutes,
        fiveMinutes,
        fiftheenMinuntes,
        thirtyMinutes,
        oneHour,
        twoHours,
        fourHours,
        sixHours,
        eightHours,
        twelveHours,
        oneDay,
        threeDays,
        oneWeek,
        oneMonth
    };
};