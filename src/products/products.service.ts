import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { paginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductService")

  onModuleInit() {
    this.$connect();
    this.logger.log("Database connect");

  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll(productpaginatioDto: paginationDto) {

    const { page, limit } = productpaginatioDto

    const totalpage = await this.product.count({where: { available: true }});
    const lastpage = Math.ceil( totalpage / limit  );

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: ( page -1 ) * 10,
        take: limit
      }),
      meta:{
        totalpage: totalpage,
        page: page,
        lastpage: lastpage
      }
    };
    //return `This action returns all products`;
  }

  async findOne(id: number) {
      const Product = await this.product.findUnique({
        where: { id,available: true }
      })

      if(!Product) throw new RpcException({
        message:`Producto no encontrado con el id: ${id}`,
        status: HttpStatus.BAD_REQUEST
      });

      return Product; 
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.product.update({
      where: { id, available: true },
      data: updateProductDto
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: { available: false}
    })
  }

  async validateProducts(ids: number[]){
    ids = Array.from(new Set(ids));


    console.log(ids);
    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    if (products.length != ids.length){
      throw new RpcException({
        message:'Some products were not found',
        status: HttpStatus.BAD_REQUEST
      })
    }

    return products;

  }
}
