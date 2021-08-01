import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../../modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../modules/users/useCases/createUser/ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it("should be able to create deposit statement", async () => {
    const user = await createUserUseCase.execute({
      name: "userStatement",
      email: "userstatement@email.com.br",
      password: "password",
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password"
    });

    const user_id = authenticatedUser.user.id;

    const deposit = {
      user_id,
      type: "deposit",
      amount: 100,
      description: "descriprtionDeposit"
    } as ICreateStatementDTO
   
    const response = await createStatementUseCase.execute(deposit)
    
    expect(authenticatedUser).toHaveProperty("token");
    expect(response).toHaveProperty("id");
  });

  it("should be able to create withdraw statement", async () => {
    const user = await createUserUseCase.execute({
      name: "userStatement",
      email: "userstatement@email.com.br",
      password: "password",
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password"
    });

    const user_id = authenticatedUser.user.id;

    const deposit = {
      user_id,
      type: "deposit",
      amount: 100,
      description: "descriprtionDeposit"
    } as ICreateStatementDTO

    const withdraw = {
      user_id,
      type: "withdraw",
      amount: 100,
      description: "descriprtionWithdraw"
    } as ICreateStatementDTO

    await createStatementUseCase.execute(deposit);
   
    const response = await createStatementUseCase.execute(withdraw)
    
    expect(authenticatedUser).toHaveProperty("token");
    expect(response).toHaveProperty("id");
  });

  it("should not be able to create statement with unexisting user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "userUnexisting",
        type: "deposit" as any,
        amount: 100,
        description: "descriprtionDeposit"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to create withdraw statement", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "userStatement",
        email: "userstatement@email.com.br",
        password: "password",
      });

      const authenticatedUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: "password"
      });
      const user_id = authenticatedUser.user.id;

      const withdraw = {
        user_id,
        type: "withdraw",
        amount: 100,
        description: "descriprtionWithdraw"
      } as ICreateStatementDTO

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});