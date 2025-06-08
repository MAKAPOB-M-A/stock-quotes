import {DataSource, Price} from "../DataSource";
import {Tickers} from "../tickers";

export class StubDataSource implements DataSource {
    private static tickersPrice = {
        [Tickers.GOLD]:  8372.41,
        [Tickers.PLATINUM]: 2750.03,
        [Tickers.RUB_USD]: 80.00,
        [Tickers.RUB_EUR]: 89.09
    }
    private static refreshTimeStamp = {
        [Tickers.GOLD]:  Date.now(),
        [Tickers.PLATINUM]: Date.now(),
        [Tickers.RUB_USD]: Date.now(),
        [Tickers.RUB_EUR]: Date.now()
    };
    constructor() {
    }
    async getCurrentForTicker(ticker: Tickers): Promise<Price> {
        if(StubDataSource._isTimeToRefresh(ticker)) {
            StubDataSource.tickersPrice[ticker] = Number((StubDataSource.tickersPrice[ticker] + StubDataSource._getRandomExchange()).toFixed(2))

        }
        return {price: StubDataSource.tickersPrice[ticker], updated: StubDataSource.refreshTimeStamp[ticker]};
    }

    static _getRandomExchange() {

            const rolls = [];

            for (let i = 0; i < 100; i++) {
                const firstRoll = StubDataSource._rollDice();
                const secondRoll = StubDataSource._rollDice();

                rolls.push([firstRoll, secondRoll]);
            }

            let maxCount = 0;
            let currentCount = 0;

            for (let i = 0; i < rolls.length; i++) {
                if (rolls[i][0] === rolls[i][1]) {
                    currentCount++;
                    maxCount = Math.max(maxCount, currentCount);
                } else {
                    currentCount = 0;
                }
            }
            const isPositive = Date.now() % 100 > 50 ? 1 : -1;
            return isPositive * (Math.floor(Math.random() * maxCount) + 1) / 100;
        }
        static _rollDice (): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    static _isTimeToRefresh(ticker: Tickers): boolean {
        const currentTimeStamp = Date.now()
        if(currentTimeStamp - this.refreshTimeStamp[ticker] > 5000) {
            this.refreshTimeStamp[ticker] = currentTimeStamp;
            return true;
        }
        return false;
    }
}
