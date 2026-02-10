import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MdmController } from './mdm.controller';
import { MdmService } from './mdm.service';
import { Account } from './entities/account.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { Vendor } from './entities/vendor.entity';
import { Location } from './entities/location.entity';
import { CostCenter } from './entities/cost-center.entity';
import { OperationUnit } from './entities/operation-unit.entity';
import { Asset } from './entities/asset.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Account,
            Product,
            Category,
            Customer,
            Vendor,
            Location,
            CostCenter,
            OperationUnit,
            Asset,
        ]),
    ],
    controllers: [MdmController],
    providers: [MdmService],
    exports: [MdmService],
})
export class MdmModule { }
