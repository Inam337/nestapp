import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig, DatabaseService } from './config/database.config';
import { CustomersModule } from './customers/customers.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchaseItemModule } from './purchase-item/purchase.item.module';
import { SaleModule } from './sale/sale.module';
import { SaleItemModule } from './sale-item/sale.item.module';
import { StockModule } from './stock/stock.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({
      isGlobal: true, // so you don't need to import it in every module
    }),
    CustomersModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    PurchaseItemModule,
    SaleModule,
    SaleItemModule,
    StockModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
