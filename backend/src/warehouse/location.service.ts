import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private locationRepository: Repository<Location>,
    ) { }

    async create(createLocationDto: Partial<Location>): Promise<Location> {
        const location = this.locationRepository.create(createLocationDto);
        return this.locationRepository.save(location);
    }

    async findAll(): Promise<Location[]> {
        return this.locationRepository.find({
            relations: ['children', 'parent'],
            where: { isActive: true }
        });
    }

    async findOne(id: string): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { id },
            relations: ['children', 'parent']
        });
        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }

    async findRoots(): Promise<Location[]> {
        // Find top-level locations (Warehouses)
        return this.locationRepository.find({
            where: { parentId: IsNull(), isActive: true },
            relations: ['children']
        });
    }

    async update(id: string, updateLocationDto: Partial<Location>): Promise<Location> {
        const location = await this.findOne(id);
        Object.assign(location, updateLocationDto);
        return this.locationRepository.save(location);
    }

    async remove(id: string): Promise<void> {
        const location = await this.findOne(id);
        location.isActive = false;
        await this.locationRepository.save(location);
    }
}
