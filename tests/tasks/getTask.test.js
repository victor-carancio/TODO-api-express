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

describe("GET /api/v1/task", () => {
  test("Should return unauthorized if not have token", async () => {
    await api
      .post("/api/v1/task/")
      .expect(401)
      .expect("Content-type", /application\/json/);
  });

  test("should return ok and json data", async () => {
    await api
      .get("/api/v1/task/")
      .set("Authorization", `Bearer ${authValues.token}`)
      .expect(200)
      .expect("Content-type", /application\/json/);
  });

  test("should return  2 tasks", async () => {
    await createTasks(authValues.userId);

    const response = await api
      .get("/api/v1/task/")
      .set("Authorization", `Bearer ${authValues.token}`);
    expect(response.body.task).toHaveLength(2);
  });
});

describe("GET /api/v1/task/:id", () => {
  test("Should return unauthorized if not have token", async () => {
    await api
      .post("/api/v1/task/")
      .expect(401)
      .expect("Content-type", /application\/json/);
  });

  test("should return 1 task", async () => {
    const task = await createTasks(authValues.userId);

    const response = await api
      .get(`/api/v1/task/${task[0]._id}`)
      .set("Authorization", `Bearer ${authValues.token}`);

    const responseData = Object.entries(response.body);
    expect(responseData).toHaveLength(1);
  });

  test("should return bad request if id not match", async () => {
    const task = await createTasks(authValues.userId);
    await api
      .get(`/api/v1/task/123`)
      .set("Authorization", `Bearer ${authValues.token}`)
      .expect(400)
      .expect("Content-type", /application\/json/);
  });
});

afterAll(() => {
  afterAllTests();
});
