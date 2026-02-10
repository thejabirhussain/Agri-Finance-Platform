import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MdmService } from './mdm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAccountDto, CreateCostCenterDto, CreateProductDto, CreateCustomerDto } from './dto/mdm.dto';

@ApiTags('MDM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mdm')
export class MdmController {
    constructor(private mdmService: MdmService) { }

    // Accounts
    @Get('accounts')
    @ApiOperation({ summary: 'Get all accounts' })
    async getAccounts() {
        return this.mdmService.findAllAccounts();
    }

    @Post('accounts')
    @ApiOperation({ summary: 'Create a new account' })
    async createAccount(@Body() dto: CreateAccountDto) {
        return this.mdmService.createAccount(dto);
    }

    @Get('accounts/:id')
    @ApiOperation({ summary: 'Get account by ID' })
    async getAccount(@Param('id') id: string) {
        return this.mdmService.findAccountById(id);
    }

    @Put('accounts/:id')
    @ApiOperation({ summary: 'Update account' })
    async updateAccount(@Param('id') id: string, @Body() dto: Partial<CreateAccountDto>) {
        return this.mdmService.updateAccount(id, dto);
    }

    @Delete('accounts/:id')
    @ApiOperation({ summary: 'Delete account (soft delete)' })
    async deleteAccount(@Param('id') id: string) {
        return this.mdmService.deleteAccount(id);
    }

    // Cost Centers
    @Get('cost-centers')
    @ApiOperation({ summary: 'Get all cost centers' })
    async getCostCenters() {
        return this.mdmService.findAllCostCenters();
    }

    @Post('cost-centers')
    @ApiOperation({ summary: 'Create cost center' })
    async createCostCenter(@Body() dto: CreateCostCenterDto) {
        return this.mdmService.createCostCenter(dto);
    }

    // Operation Units
    @Get('operation-units')
    @ApiOperation({ summary: 'Get all operation units' })
    async getOperationUnits() {
        return this.mdmService.findAllOperationUnits();
    }

    // Products
    @Get('products')
    @ApiOperation({ summary: 'Get all products' })
    async getProducts() {
        return this.mdmService.findAllProducts();
    }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    async createProduct(@Body() dto: CreateProductDto) {
        return this.mdmService.createProduct(dto);
    }

    @Get('products/:id')
    @ApiOperation({ summary: 'Get product by ID' })
    async getProduct(@Param('id') id: string) {
        return this.mdmService.findProductById(id);
    }

    @Put('products/:id')
    @ApiOperation({ summary: 'Update product' })
    async updateProduct(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
        return this.mdmService.updateProduct(id, dto);
    }

    @Delete('products/:id')
    @ApiOperation({ summary: 'Delete product (soft delete)' })
    async deleteProduct(@Param('id') id: string) {
        return this.mdmService.deleteProduct(id);
    }

    // Customers
    @Get('customers')
    @ApiOperation({ summary: 'Get all customers' })
    async getCustomers() {
        return this.mdmService.findAllCustomers();
    }

    @Post('customers')
    @ApiOperation({ summary: 'Create a new customer' })
    async createCustomer(@Body() dto: CreateCustomerDto) {
        return this.mdmService.createCustomer(dto);
    }

    @Get('customers/:id')
    @ApiOperation({ summary: 'Get customer by ID' })
    async getCustomer(@Param('id') id: string) {
        return this.mdmService.findCustomerById(id);
    }

    @Put('customers/:id')
    @ApiOperation({ summary: 'Update customer' })
    async updateCustomer(@Param('id') id: string, @Body() dto: Partial<CreateCustomerDto>) {
        return this.mdmService.updateCustomer(id, dto);
    }

    @Delete('customers/:id')
    @ApiOperation({ summary: 'Delete customer (soft delete)' })
    async deleteCustomer(@Param('id') id: string) {
        return this.mdmService.deleteCustomer(id);
    }

    // Vendors
    @Get('vendors')
    @ApiOperation({ summary: 'Get all vendors' })
    async getVendors() {
        return this.mdmService.findAllVendors();
    }

    @Post('vendors')
    @ApiOperation({ summary: 'Create a new vendor' })
    async createVendor(@Body() dto: any) {
        return this.mdmService.createVendor(dto);
    }

    // Assets
    @Get('assets')
    @ApiOperation({ summary: 'Get all assets' })
    async getAssets() {
        return this.mdmService.findAllAssets();
    }

    @Post('assets')
    @ApiOperation({ summary: 'Create a new asset' })
    async createAsset(@Body() dto: any) {
        return this.mdmService.createAsset(dto);
    }

    @Get('assets/:id')
    @ApiOperation({ summary: 'Get asset by ID' })
    async getAsset(@Param('id') id: string) {
        return this.mdmService.findAssetById(id);
    }

    // Categories
    @Get('categories')
    @ApiOperation({ summary: 'Get all categories' })
    async getCategories() {
        return this.mdmService.findAllCategories();
    }

    @Post('categories')
    @ApiOperation({ summary: 'Create a new category' })
    async createCategory(@Body() dto: any) {
        return this.mdmService.createCategory(dto);
    }

    // Locations
    @Get('locations')
    @ApiOperation({ summary: 'Get all locations' })
    async getLocations() {
        return this.mdmService.findAllLocations();
    }

    @Post('locations')
    @ApiOperation({ summary: 'Create a new location' })
    async createLocation(@Body() dto: any) {
        return this.mdmService.createLocation(dto);
    }
}
