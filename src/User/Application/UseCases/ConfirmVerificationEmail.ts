import { ICommand, ICommandHandler } from '@nestjs/cqrs'
import Result from 'src/Common/Application/Result'
import { ConfirmVerificationEmailCommand } from 'src/User/Application/Commands/ConfirmVerificationEmailCommand'

export interface ConfirmVerificationEmail extends ICommandHandler<ConfirmVerificationEmailCommand, void> {}
