import {DataSource, Price} from "../DataSource";
import {Tickers} from "../tickers";
import {Fetcher} from "../../utilites/fetch";

const EXCHANGE_URL = process.env.EXCHANGE_URL;
const EXCHANGE_ACCESS_KEY = process.env.EXCHANGE_ACCESS_KEY;

export class ExchangeDataSource implements DataSource {

    async getCurrentForTicker(ticker: string): Promise<Price> {
        let price: Price | undefined = undefined;
        console.log(`${EXCHANGE_URL}/latest.json?app_id=${EXCHANGE_ACCESS_KEY}&symbols=${ticker}`)
        await Fetcher.fetch<ExchangeResponse>(`${EXCHANGE_URL}/latest.json?app_id=${EXCHANGE_ACCESS_KEY}&symbols=${ticker}`, {})
            .then(r => {
                console.log(r)
                price = {
                    price: r.rates[ticker],
                    updated: r.timestamp

                }
            })
            .catch(e => {
                console.error(e)
            })
        if (!price) {
            throw new Error("No price found for exchange");
        }
        return price
    }

}


type ExchangeResponse = {
    "disclaimer": string,
    "license": string,
    "timestamp": number,
    "base": "USD",
    "rates":  Record<string, number>
}