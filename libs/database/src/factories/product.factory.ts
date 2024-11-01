import { ProductEntity } from "src/product/entities/product.entity";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(ProductEntity, (faker) => {
    const product = new ProductEntity();

    product.name = faker.commerce.productName();
    product.description = faker.commerce.productDescription();
    product.price = +faker.commerce.price({ min: 100000, max: 10000000 });
    
    return product;
});