const {
  beforeEachTest,
  initialUser,
  api,
  afterAllTests,
} = require("./helpers");

beforeEach(async () => {
  await beforeEachTest();
});

describe("POST /auth/login", () => {
  test("should return bad request if no data is sent ", async () => {
    await api
      .post("/api/v1/auth/login")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("should return Unauthorized if email is no valid", async () => {
    await api
      .post("/api/v1/auth/login")
      .send({
        email: "novalidemail@gmail",
        password: initialUser.password,
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("should return Unauthorized if password is no valid", async () => {
    await api
      .post("/api/v1/auth/login")
      .send({
        email: "victor@gmail.com",
        password: "12345",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return ok if credentials are valid", async () => {
    await api
      .post("/api/v1/auth/login")
      .send({ email: initialUser.email, password: initialUser.password })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return token if credentials are valid", async () => {
    const response = await api
      .post("/api/v1/auth/login")
      .send({ email: initialUser.email, password: initialUser.password });
    expect(response.body).toHaveProperty("token");
  });
});

describe("POST /register", () => {
  test("should return bad request if no data is sent", async () => {
    await api
      .post("/api/v1/auth/register")
      .send()
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  test("should return created if data are valid", async () => {
    await api
      .post("/api/v1/auth/register")
      .send({ name: "jio", email: "jio@gmail.com", password: "12345678" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
  test("should return bad request if email already exist", async () => {
    await api
      .post("/api/v1/auth/register")
      .send({ name: "jio", email: "jio@gmail.com", password: "12345678" });
    await api
      .post("/api/v1/auth/register")
      .send({ name: "jio", email: "jio@gmail.com", password: "12345678" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("should return token if user has registered ", async () => {
    const response = await api
      .post("/api/v1/auth/register")
      .send({ name: "jio", email: "jio@gmail.com", password: "12345678" });
    expect(response.body).toHaveProperty("token");
  });

  test("should return bad request if password has less than 6 characters", async () => {
    await api
      .post("/api/v1/auth/register")
      .send({ name: "jio", email: "jio@gmail.com", password: "12345" })
      .expect(400);
  });
});

afterAll(() => {
  afterAllTests();
});
