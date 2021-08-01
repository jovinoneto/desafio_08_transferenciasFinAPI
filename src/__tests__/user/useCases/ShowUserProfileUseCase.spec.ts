import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../modules/users/useCases/createUser/ICreateUserDTO";
import { ShowUserProfileError } from "../../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "userProfile",
      email: "userprofile@email.com",
      password: "password"
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password"
    });

    const userProfile = await showUserProfileUseCase.execute(authenticatedUser.user.id as string)

    expect(userProfile).toHaveProperty("id")
    expect(userProfile).toHaveProperty("name")
    expect(userProfile).toHaveProperty("email")
    expect(userProfile).toHaveProperty("password")
  });

  it("should not be able to show user profile of non-existing user", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "userProfileUnexisting",
        email: "userprofileunexisting@email.com",
        password: "password"
      });
  
      const authenticatedUser = await authenticateUserUseCase.execute({
        email: user.email,
        password: "password"
      });

      const userProfile = await showUserProfileUseCase.execute("id_Unexisting")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  });

});