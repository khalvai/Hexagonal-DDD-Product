import { IQueryHandler } from '@nestjs/cqrs'
import { GetAllQuery } from 'src/Product/Application/Queries/GetAllQuery'
import { Product } from 'src/Product/Domain/Product'
import { ProductReadModel } from 'src/Product/Infrastructure/Models/ProductReadModel'

export interface GetAll extends IQueryHandler<GetAllQuery, ProductReadModel[]> {}
