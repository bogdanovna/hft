import {Channel, KuWs} from "@hft/types/ku";
import { Payload } from '@hft/types/ku';
import {Level2_subscription_manager} from "./level2.subscription-manager";
import {WebSocket} from "ws";
import {MessageHandler} from "./message-handler";
import {ISubscriptionManager} from "./subscription-manager.interface";

// TODO add typings and move somewhere in project
function genNoSubjectCaser(managers: ISubscriptionManager[]) {
  const caser = {
    pong(jData) {
      // TODO,
    },
    ack(jData: KuWs['ACK']['SUB']['PAYLOAD']) {
      void managers.some((m) => m.ack(jData));
    },
  }

  return (jData) => caser[jData.type](jData);
}

export class SubscriptionManager implements Record<keyof Pick<KuWs, Channel | 'PING_PONG'>, any>{k
  private readonly messageHandler: MessageHandler;

  public getMessageHandler() {
    return this.messageHandler;
  }
  private readonly level2: Level2_subscription_manager;
  constructor(private ws: WebSocket) {
    this.level2 = new Level2_subscription_manager(ws);

    const managersByChanel = [this.level2];

    this.messageHandler = new MessageHandler(genNoSubjectCaser(managersByChanel));
  }
  async LEVEL_2(firstPayload: Omit<
    Payload<'LEVEL_2'>,
    keyof Pick<Payload<'LEVEL_2'>, 'type'>
  >) {
    const isSended = await this.level2.send({
      ...firstPayload,
      type: 'subscribe',
    });

    if (!isSended) { // TODO write tests and rm this check
      throw new Error();
    }

    return this.level2;
  }
  PING_PONG() {
    // TODO
  }
}
