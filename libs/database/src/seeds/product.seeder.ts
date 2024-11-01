import { ProductEntity } from "src/product/entities/product.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class ProductSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const postFactory = await factoryManager.get(ProductEntity);

        await postFactory.saveMany(10);
    }
    
}