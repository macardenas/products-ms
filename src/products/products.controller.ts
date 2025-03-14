import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { paginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({ cmd: 'create_product'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'get_all_product'})
  findAll( @Payload() productpaginatioDto: paginationDto) {
    return this.productsService.findAll(productpaginatioDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_product'})
  findOne(@Payload('id') id: number) {
    return this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product'})
  update(@Payload('id') id: string, @Payload('data') updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product'})
  remove(@Payload() id: string) {
    console.log(id);
    return this.productsService.remove(+id);
  }

  @MessagePattern({ cmd: 'validate_products'})
  validateProduct(@Payload() ids: number[]) {

    console.log("Me llego esto");
    console.log(ids);
    return this.productsService.validateProducts(ids);
  }
}
