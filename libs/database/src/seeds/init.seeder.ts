import { DataSource } from "typeorm";
import { runSeeders, Seeder, SeederFactoryManager } from "typeorm-extension";

import ProductSeeder from "./product.seeder";
import productFactory from "@libs/database/factories/product.factory";


export default class InitSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        await runSeeders(dataSource, {
            seeds: [ProductSeeder],
            factories: [productFactory]
          });
    }
    
}