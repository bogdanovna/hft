import { CurrencyPair } from "../core";
import { KuHeaders } from "./ku-headers";

type URL = 'https://api.kucoin.com';


export type KuHttp = {
    '/api/v1/bullet-public': {
        url: `${URL}/api/v1/bullet-public`,
        req: {
            method: 'POST',
            query?: never,
            body?: never,
            headers?: never,
        },
        res: {
            code: "200000",
            data: {
                token: string,
                instanceServers: {
                    endpoint: "wss://ws-api-spot.kucoin.com/",
                    encrypt: true,
                    protocol: "websocket",
                    pingInterval: number,
                    pingTimeout: number,
                }[],
            },
        },
    },
    '/api/v1/bullet-private': {
        url: `${URL}/api/v1/bullet-private`,
        req: {
            method: 'POST',
            query?: never,
            body?: never,
            headers: KuHeaders,
        },
        res: {
            code: "200000",
            data: {
                token: string,
                instanceServers: {
                    endpoint: "wss://ws-api-spot.kucoin.com/",
                    encrypt: true,
                    protocol: "websocket",
                    pingInterval: number,
                    pingTimeout: number,
                }[],
            }
        },
    },
    '/api/v3/market/orderbook/level2': {
        url: `${URL}/api/v3/market/orderbook/level2`,
        req: {
            method: 'GET',
            query: { symbol: CurrencyPair },
            body?: never,
            headers: KuHeaders,
        },
        res: {
            type: 'message',
            topic: string,
            subject: 'trade.l2update',
            data: {
                asks: [string, string][],
                bids: [string, string][],
                sequence: string,
                symbol: CurrencyPair,
                time: number,
            },
        },
    },
};

export type Endpoint = keyof KuHttp;

export type KuReq<T extends Endpoint = Endpoint> = [
    KuHttp[T]['req']['headers'] extends never | void
    ? { url: KuHttp[T]['url'] }
    : {
        url: KuHttp[T]['url'],
        forSignature: {
            endpoint: T,
        } & Omit<KuHttp[T]['req'],
            Exclude<keyof KuHttp[T]['req'], keyof Partial<KuHttp[T]['req']>>
            | 'headers'>
    },
    Omit<KuHttp[T]['req'],
        Exclude<keyof KuHttp[T]['req'], keyof Partial<KuHttp[T]['req']>>>
];

export type KuRes<T extends Endpoint = Endpoint> = KuHttp[T]['res'];
