
export interface DataSource {
    getCurrentForTicker(ticker: String): Promise<Price>;
}

export type Price = {
    price: number;
    updated: number;
}
