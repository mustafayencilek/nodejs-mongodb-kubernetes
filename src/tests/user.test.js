require("dotenv").config();
const request = require("supertest");
const server = require("../index");
const { dbConnect, dbDisconnect } = require("../utils/test-utils/dbHandler.utils");
dbConnect();

afterAll(async () => dbDisconnect());
afterAll(() => server.close());

describe("GET /users", () => {
  test("should return all users", async () => {
    return request(server)
      .get("/users")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("GET /users/:id", () => {
  test("should return a specific user by id", async () => {
    const createUserResponse = await request(server)
      .post("/users")
      .send({
        name: "Test",
        surname: "User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(201);
    const userId = createUserResponse.body._id;
    const a = `/users/${userId}`;
    const response = await request(server).get(a).expect(200);
    expect(response.body[0]).toHaveProperty("_id", createUserResponse.body._id);
    expect(response.body[0]).toHaveProperty("name", "Test");
    expect(response.body[0]).toHaveProperty("surname", "User");
    expect(response.body[0]).toHaveProperty("email", "test@example.com");
    expect(response.body[0]).toHaveProperty("balance");
    expect(response.body[0]).toHaveProperty("accountNumber");
  });
  test("should return a not found error if user id does not exist", async () => {
    const response = await request(server).get("/users/66376bdfe40c90f806c17d77").expect(404);
    expect(response.body.msg).toBe("No user found with this id");
  });
});

describe("POST /users", () => {
  test("should create a new user with a unique email", async () => {
    const userData = {
      name: "test6",
      surname: "test6",
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users").send(userData).expect(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.surname).toBe(userData.surname);
    expect(response.body.email).toBe(userData.email);
  });

  test("should return a conflict error if email is already taken", async () => {
    const userData = {
      name: "test6",
      surname: "test6",
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users").send(userData).expect(409);
    expect(response.body.msg).toBe("requested email already taken");
  });
});

describe("POST /users/login", () => {
  test("should login a user with correct credentials", async () => {
    const loginData = {
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users/login").send(loginData).expect(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("surname");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("balance");
    expect(response.body).toHaveProperty("accountNumber");
    expect(response.body).toHaveProperty("tokens");
  });

  test("should return a not found error for incorrect credentials", async () => {
    const response = await request(server)
      .post("/users/login")
      .send({
        email: "nonexistentemail@example.com",
        password: "12345678",
      })
      .expect(404);
    expect(response.body.msg).toBe("user not found");
  });
});
describe("GET /users/balance", () => {
  test("should return balance of users", async () => {
    const loginData = {
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users/login").send(loginData).expect(200);
    const token = response.body.tokens.acces_token;
    return request(server)
      .get("/users/balance")
      .set("authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("GET /users/transactions", () => {
  test("should return all transactions of users", async () => {
    const loginData = {
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users/login").send(loginData).expect(200);
    const token = response.body.tokens.acces_token;
    return request(server)
      .get("/users/transactions")
      .set("authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res) => {
        if (res.msg) {
          expect(res.statusCode).toBe(200);
        } else {
          expect(res.statusCode).toBe(404);
        }
      });
  });
});

describe("GET /users/transactions/receiver", () => {
  test("should return all transactions where the user is the receiver", async () => {
    const loginData = {
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users/login").send(loginData).expect(200);
    const token = response.body.tokens.acces_token;
    return request(server)
      .get("/users/transactions/receiver")
      .set("authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res) => {
        if (res.msg) {
          expect(res.statusCode).toBe(200);
        } else {
          expect(res.statusCode).toBe(404);
        }
      });
  });
});

describe("GET /users/transactions/sender", () => {
  test("should return all transactions where the user is the sender", async () => {
    const loginData = {
      password: "12345678",
      email: "test9@gmail.com",
    };
    const response = await request(server).post("/users/login").send(loginData).expect(200);
    const token = response.body.tokens.acces_token;
    return request(server)
      .get("/users/transactions/sender")
      .set("authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((res) => {
        if (res.msg) {
          expect(res.statusCode).toBe(200);
        } else {
          expect(res.statusCode).toBe(404);
        }
      });
  });
});
