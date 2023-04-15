import { KuHttpService } from '@hft/ku/http';
import { ConnectionManager } from '@hft/ku/ws';
import { log } from '@hft/utils';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { OrderBookKuService } from '..';


config({ path: `.${process.env.NODE_ENV}.env` });
describe('example', () => {
  const _kuHttp = new KuHttpService(new ConfigService(process.env));
  const orderBookService = new OrderBookKuService(_kuHttp, new ConnectionManager(_kuHttp));

  it('get full order book', async () => {
    const res = await _kuHttp.GET_full_order_book('BTC-USDT');

    log(res);
  });

  it('my lab', async () => {
    await orderBookService.init();
  });
});
