import { IQueryHandler } from '@nestjs/cqrs'
import Result from 'src/Common/Application/Result'
import { LoginQuery } from 'src/User/Application/Queries/LoginQuery'

export interface Login extends IQueryHandler<LoginQuery, string> {}
