import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "../../../shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "userAuthenticate",
      email: "userauthenticate@email.com.br",
      password: "password",
    });

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password",
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate user with incorrect email", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "userIncorrectEmail",
        email: "userincorrectemail@email.com.br",
        password: "password",
      });

      await authenticateUserUseCase.execute({
        email: "incorrect",
        password: "password",
      });
      
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with incorrect password", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "userIncorrectPassword",
        email: "userincorrectpassword@email.com.br",
        password: "password",
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});