// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WatchlistEntry = {
    symbol: string;
};

export type TradeType = 'buy' | 'sell';

export interface Trade {
    id: string;
    symbol: string;
    shares: number;
    price: number;
    date: string; // ISO format string
    type: TradeType; // 'buy' or 'sell'
}
