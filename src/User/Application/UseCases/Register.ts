import { ICommandHandler } from '@nestjs/cqrs'
import Result from 'src/Common/Application/Result'
import { RegisterCommand } from 'src/User/Application/Commands/RegisterCommand'

export interface Register extends ICommandHandler<RegisterCommand, Result<void>> {}
