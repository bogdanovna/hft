import { KuHttpModule } from '@hft/ku/http';
import { KuWsModule } from '@hft/ku/ws';
import { Module } from '@nestjs/common';
import { OrderBookKuService } from './order-book-ku.service';

@Module({
  imports: [KuHttpModule, KuWsModule],
  providers: [OrderBookKuService],
  exports: [OrderBookKuService],
})
export class OrderBookKuModule {}
