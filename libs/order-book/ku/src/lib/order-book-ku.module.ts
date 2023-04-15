import { KuHttpModule } from '@hft/ku/http';
import { KuWsModule } from '@hft/ku/ws';
import { Module } from '@nestjs/common';

@Module({
  providers: [KuHttpModule, KuWsModule],
})
export class OrderBookKuModule {}
