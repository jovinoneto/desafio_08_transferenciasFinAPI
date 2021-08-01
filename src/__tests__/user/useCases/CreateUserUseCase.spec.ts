import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "userCreate",
      email: "usercreate@email.com.br",
      password: "password",
    });
    
    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with already used email", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "userAlreadyExists",
        email: "useralreadyexists@email.com.br",
        password: "password"
      });
  
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });

});