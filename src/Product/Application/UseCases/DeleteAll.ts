import { ICommandHandler } from '@nestjs/cqrs'
import { DeleteAllCommand } from 'src/Product/Application/Commands/DeleteAllCommand'

export interface DeleteAll extends ICommandHandler<DeleteAllCommand, Promise<void>> {}
