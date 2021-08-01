import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const sender_id = request.user.id;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      user_id,
      sender_id,
      amount,
      description,
    });

    return response.json(transfer);
  }
}