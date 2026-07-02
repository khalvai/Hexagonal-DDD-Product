import { ICommandHandler } from '@nestjs/cqrs'
import CreateManyCommand from 'src/Product/Application/Commands/CreateManyCommand'

export default interface CreateMany extends ICommandHandler<CreateManyCommand, void> {}
