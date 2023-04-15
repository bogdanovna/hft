import { CurrencyPair, KuEnvKeys, KuHttp, KuReq, KuRes } from "@hft/types/ku";
import { OmitReplace } from '@hft/utils';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { request } from 'undici';
import { SignGenerator } from "./sign-generator";

type _Keys = Record<KuEnvKeys, string>;
type Level2ResData = KuRes<'/api/v3/market/orderbook/level2'>;
type T_data = Level2ResData['data'];
type NumeratedLevel2Res = OmitReplace<
  Level2ResData, {
    data: OmitReplace<T_data,
      {
        sequence: number,
        bids: [number, number][],
        asks: [number, number][],
      }>
  }>;
@Injectable()
export class KuHttpService {
  private signGenerator = new SignGenerator();
  private keys: _Keys;
  private http = request;

  constructor(
    private configService: ConfigService<_Keys, true>,
  ) {
    this.keys = {
      API_KEY: this.configService.get('API_KEY'),
      API_SECRET: this.configService.get('API_SECRET'),
      API_PASSPHRASE: this.configService.get('API_PASSPHRASE'),
    };
  }

  public async POST_apply_public_connect_token() {
    const url: KuReq<'/api/v1/bullet-public'>[0]['url'] = 'https://api.kucoin.com/api/v1/bullet-public';
    const payload: KuReq<'/api/v1/bullet-public'>[1] = {
      method: 'POST'
    };

    return this
      .http(url, payload)
      .then(({ body }) => body.json() as Promise<KuHttp['/api/v1/bullet-public']['res']>)
      .then(({ data: { instanceServers: [{ endpoint, pingInterval, pingTimeout }], token } }) => ({
        endpoint,
        token,
        pingInterval,
        pingTimeout,
      }));
  }

  public async POST_apply_private_connect_token() {
    const url: KuReq<'/api/v1/bullet-private'>[0]['url'] = 'https://api.kucoin.com/api/v1/bullet-private';
    const forSignature: KuReq<'/api/v1/bullet-private'>[0]['forSignature'] = {
      endpoint: '/api/v1/bullet-private',
      method: 'POST',
    };
    const headers = this.signGenerator.generateHeaders(forSignature, this.keys);
    const payload: KuReq<'/api/v1/bullet-private'>[1] = {
      method: 'POST',
      headers,
    };

    return this
      .http(url, payload)
      .then(({ body }) => body.json() as Promise<KuHttp['/api/v1/bullet-private']['res']>)
      .then(({ data: { instanceServers: [{ endpoint, pingInterval, pingTimeout }], token } }) => ({
        endpoint,
        token,
        pingInterval,
        pingTimeout,
      }));
  }

  public async GET_full_order_book(symbol: CurrencyPair, floatStringsToNumber: false): Promise<Level2ResData>;
  public async GET_full_order_book(symbol: CurrencyPair, floatStringsToNumber: true): Promise<NumeratedLevel2Res>;
  public async GET_full_order_book(symbol: CurrencyPair): Promise<NumeratedLevel2Res>;
  public async GET_full_order_book(symbol: CurrencyPair, floatStringsToNumber = true) {
    const url: KuReq<'/api/v3/market/orderbook/level2'>[0]['url'] = 'https://api.kucoin.com/api/v3/market/orderbook/level2';
    const forSignature: KuReq<'/api/v3/market/orderbook/level2'>[0]['forSignature'] = {
      endpoint: '/api/v3/market/orderbook/level2',
      method: 'GET',
      query: { symbol },
    };
    const headers = this.signGenerator.generateHeaders(forSignature, this.keys);
    const payload: KuReq<'/api/v3/market/orderbook/level2'>[1] = {
      headers,
      method: 'GET',
      query: { symbol },
    };

    type T_body = Level2ResData;

    return this.http(url, payload)
      .then(({ body }) => body.json() as Promise<T_body>)
      .then((res) => {

        if (!floatStringsToNumber) return res;

        return {
          ...res,
          data: {
            ...res.data,
            sequence: parseFloat(res.data.sequence),
            bids: res.data.bids.map((arr) => arr.map((a) => parseFloat(a)) as [number, number]),
            asks: res.data.bids.map((arr) => arr.map((a) => parseFloat(a)) as [number, number]),
          },
        };
      });
  }
}
