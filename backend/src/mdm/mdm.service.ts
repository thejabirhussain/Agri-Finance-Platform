import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { Vendor } from './entities/vendor.entity';
import { Location } from './entities/location.entity';
import { CostCenter } from './entities/cost-center.entity';
import { OperationUnit } from './entities/operation-unit.entity';
import { Asset } from './entities/asset.entity';

@Injectable()
export class MdmService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        @InjectRepository(Location)
        private locationRepository: Repository<Location>,
        @InjectRepository(CostCenter)
        private costCenterRepository: Repository<CostCenter>,
        @InjectRepository(OperationUnit)
        private operationUnitRepository: Repository<OperationUnit>,
        @InjectRepository(Asset)
        private assetRepository: Repository<Asset>,
    ) { }

    // Accounts
    async createAccount(data: Partial<Account>): Promise<Account> {
        const account = this.accountRepository.create({
            ...data,
            currentBalance: data.openingBalance || 0,
        });
        return this.accountRepository.save(account);
    }

    async findAllAccounts(): Promise<Account[]> {
        return this.accountRepository.find({ where: { isActive: true } });
    }

    async findAccountById(id: string): Promise<Account> {
        const account = await this.accountRepository.findOne({ where: { id, isActive: true } });
        if (!account) throw new BadRequestException('Account not found');
        return account;
    }

    async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
        await this.accountRepository.update(id, data);
        return this.findAccountById(id);
    }

    async deleteAccount(id: string): Promise<void> {
        await this.accountRepository.update(id, { isActive: false });
    }

    // Cost Centers
    async createCostCenter(data: Partial<CostCenter>): Promise<CostCenter> {
        const costCenter = this.costCenterRepository.create(data);
        return this.costCenterRepository.save(costCenter);
    }

    async findAllCostCenters(): Promise<CostCenter[]> {
        return this.costCenterRepository.find({ where: { isActive: true } });
    }

    async findCostCenterById(id: string): Promise<CostCenter> {
        const center = await this.costCenterRepository.findOne({ where: { id, isActive: true } });
        if (!center) throw new BadRequestException('Cost center not found');
        return center;
    }

    // Operation Units
    async createOperationUnit(data: Partial<OperationUnit>): Promise<OperationUnit> {
        const unit = this.operationUnitRepository.create(data);
        return this.operationUnitRepository.save(unit);
    }

    async findAllOperationUnits(): Promise<OperationUnit[]> {
        return this.operationUnitRepository.find({ where: { isActive: true } });
    }

    // Products
    async createProduct(data: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(data);
        return this.productRepository.save(product);
    }

    async findAllProducts(): Promise<Product[]> {
        return this.productRepository.find({
            where: { isActive: true },
            relations: ['category'],
        });
    }

    async findProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id, isActive: true },
            relations: ['category'],
        });
        if (!product) throw new BadRequestException('Product not found');
        return product;
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await this.productRepository.update(id, data);
        return this.findProductById(id);
    }

    async deleteProduct(id: string): Promise<void> {
        await this.productRepository.update(id, { isActive: false });
    }

    // Customers
    async createCustomer(data: Partial<Customer>): Promise<Customer> {
        const customer = this.customerRepository.create(data);
        return this.customerRepository.save(customer);
    }

    async findAllCustomers(): Promise<Customer[]> {
        return this.customerRepository.find({ where: { isActive: true } });
    }

    async findCustomerById(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({ where: { id, isActive: true } });
        if (!customer) throw new BadRequestException('Customer not found');
        return customer;
    }

    async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
        await this.customerRepository.update(id, data);
        return this.findCustomerById(id);
    }

    async deleteCustomer(id: string): Promise<void> {
        await this.customerRepository.update(id, { isActive: false });
    }

    // Vendors
    async createVendor(data: Partial<Vendor>): Promise<Vendor> {
        const vendor = this.vendorRepository.create(data);
        return this.vendorRepository.save(vendor);
    }

    async findAllVendors(): Promise<Vendor[]> {
        return this.vendorRepository.find({ where: { isActive: true } });
    }

    async findVendorById(id: string): Promise<Vendor> {
        const vendor = await this.vendorRepository.findOne({ where: { id, isActive: true } });
        if (!vendor) throw new BadRequestException('Vendor not found');
        return vendor;
    }

    async updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
        await this.vendorRepository.update(id, data);
        return this.findVendorById(id);
    }

    async deleteVendor(id: string): Promise<void> {
        await this.vendorRepository.update(id, { isActive: false });
    }

    // Assets
    async createAsset(data: Partial<Asset>): Promise<Asset> {
        const asset = this.assetRepository.create({
            ...data,
            currentValue: data.purchaseValue || 0,
        });
        return this.assetRepository.save(asset);
    }

    async findAllAssets(): Promise<Asset[]> {
        return this.assetRepository.find({
            where: { isActive: true },
            relations: ['category', 'location', 'costCenter', 'operationUnit'],
        });
    }

    async findAssetById(id: string): Promise<Asset> {
        const asset = await this.assetRepository.findOne({
            where: { id, isActive: true },
            relations: ['category', 'location', 'costCenter', 'operationUnit'],
        });
        if (!asset) throw new BadRequestException('Asset not found');
        return asset;
    }

    async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
        await this.assetRepository.update(id, data);
        return this.findAssetById(id);
    }

    async deleteAsset(id: string): Promise<void> {
        await this.assetRepository.update(id, { isActive: false });
    }

    // Categories
    async createCategory(data: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    async findAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find({ where: { isActive: true } });
    }

    // Locations
    async createLocation(data: Partial<Location>): Promise<Location> {
        const location = this.locationRepository.create(data);
        return this.locationRepository.save(location);
    }

    async findAllLocations(): Promise<Location[]> {
        return this.locationRepository.find({ where: { isActive: true } });
    }
}
