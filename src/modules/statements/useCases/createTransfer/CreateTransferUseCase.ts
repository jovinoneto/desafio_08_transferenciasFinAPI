import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({ user_id, sender_id, description, amount }: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(sender_id);
  
    if (!sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const receiver = await this.usersRepository.findById(user_id);

    if (!receiver) {
      throw new CreateTransferError.ReceiverNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount ) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const transfer = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });
    
    return transfer;
  }
}
