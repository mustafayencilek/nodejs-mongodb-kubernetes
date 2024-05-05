require("dotenv").config();
const request = require("supertest");
const server = require("../index");
const { dbConnect, dbDisconnect } = require("../utils/test-utils/dbHandler.utils");
dbConnect();

afterAll(async () => dbDisconnect());
afterAll(() => server.close());

describe("POST /transactions", () => {
  test("should create a new user with a unique email", async () => {
    const userData1 = {
      name: "test6",
      surname: "test6",
      password: "12345678",
      email: "test99@gmail.com",
    };
    const userData2 = {
      name: "test6",
      surname: "test6",
      password: "12345678",
      email: "test100@gmail.com",
    };
    const loginData = {
      password: "12345678",
      email: "test99@gmail.com",
    };
    const response1 = await request(server).post("/users").send(userData1).expect(201);
    const response2 = await request(server).post("/users").send(userData2).expect(201);
    const loginResponse = await request(server).post("/users/login").send(loginData).expect(200);
    console.log(response2.body.accountNumber);
    const transaction = {
      receiver: response2.body.accountNumber,
      amount: 70,
    };
    const token = loginResponse.body.tokens.acces_token;
    const transactionResponse = await request(server)
      .post("/transactions")
      .set("authorization", `Bearer ${token}`)
      .send(transaction)
      .expect(200);

    expect(transactionResponse.body).toHaveProperty("message", "Payment successful");
  });
});
