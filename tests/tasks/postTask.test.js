const {
  beforeEachTest,
  initialUser,
  api,
  afterAllTests,
  getAuthorizationToken,
  createTasks,
} = require("../helpers");

const authValues = {
  token: "",
  userId: "",
};

beforeEach(async () => {
  await beforeEachTest();
  const response = await getAuthorizationToken();
  authValues.token = response.body.token;
  authValues.userId = response.body.user.id;
});

describe("POST /api/v1/task/:id", () => {
  test("Should return Unauthorized if no have token", async () => {
    await api
      .post("/api/v1/task/")
      .expect(401)
      .expect("Content-type", /application\/json/);
  });

  test("Should return internal server error if not have data", async () => {
    await api
      .post("/api/v1/task/")
      .set("Authorization", `Bearer ${authValues.token}`)
      .send({ createdBy: authValues.userId })
      .expect(500);
  });

  test("Should return created", async () => {
    await api
      .post("/api/v1/task/")
      .set("Authorization", `Bearer ${authValues.token}`)
      .send({ task: "supertest example", createdBy: authValues.userId })
      .expect(201)
      .expect("Content-type", /application\/json/);
  });
});

afterAll(() => {
  afterAllTests();
});
