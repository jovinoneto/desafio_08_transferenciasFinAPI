import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  });

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "userGetStatement",
      email: "usergetstatement@email.com",
      password: "password"
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password"
    });

    const user_id = authenticatedUser.user.id as string;

    const deposit = {
      user_id,
      type: "deposit" as any,
      amount: 100,
      description: "descriprtionDeposit"
    };

    const statement = await createStatementUseCase.execute(deposit);
    const statement_id = statement.id as string;
    const getStatementOperation = await getStatementOperationUseCase.execute({ statement_id, user_id });

    expect(getStatementOperation).toHaveProperty("id");
  });

  it("should not be able to get unexisting statement operation", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "statementUnexisting",
        email: "statementunexisting@email.com",
        password: "password"
      });
  
      const authenticatedUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: "password"
      });

      const user_id = authenticatedUser.user.id as string;
      const statement_id = "id";

      await getStatementOperationUseCase.execute({ statement_id, user_id });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});