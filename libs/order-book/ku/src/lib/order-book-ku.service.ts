import { KuHttpService } from '@hft/ku/http';
import { ConnectionManager } from '@hft/ku/ws';
import { log } from '@hft/utils';
import { Injectable } from "@nestjs/common";
import { inspect } from 'util';

@Injectable()
export class OrderBookKuService {
  constructor(
    private http: KuHttpService,
    private connectMan: ConnectionManager,
  ) { }

  async init() {
    const subMan = await this.connectMan.connect();
    const handler = subMan.getMessageHandler();

    handler.addHandler('LEVEL_2', (jData) => {
      // log(jData);
    });

    const id1 = Date.now().toString();
    const level2 = await subMan.LEVEL_2({
      id: id1,
      privateChannel: false,
      topic_second_splitted_by_comma_part: ['BTC-USDT'],
    });

    const res = await this.http.GET_full_order_book('BTC-USDT');

    log(res);

    await level2.send({
      type: 'unsubscribe',
      id: id1,
      privateChannel: false,
      topic_second_splitted_by_comma_part: ['BTC-USDT'],
    });
    await this.connectMan.disconnect();


    // await pause(5_000);
  }
}
