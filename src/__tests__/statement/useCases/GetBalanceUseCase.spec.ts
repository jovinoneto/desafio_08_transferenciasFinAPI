import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../../modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
      inMemoryUsersRepository = new InMemoryUsersRepository();
      inMemoryStatementsRepository = new InMemoryStatementsRepository();
      createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
      authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
      createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
      getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "userBalance",
      email: "userbalance@email.com.br",
      password: "password",
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password"
    });
    const user_id = authenticatedUser.user.id as string;
    const beforeBalance = await getBalanceUseCase.execute({ user_id });

    await createStatementUseCase.execute({
        user_id,
        type: "deposit" as any,
        amount: 100,
        description: "descriprtionDeposit"
    });

    const laterBalance = await getBalanceUseCase.execute({ user_id });

    expect(beforeBalance.balance).toBe(0)
    expect(laterBalance.balance).toBe(100)
  });

  it("should not be able to get balance of unexisting user", async () => {
    expect(async () => {
        const user_id = "unexistingUser"

        await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});