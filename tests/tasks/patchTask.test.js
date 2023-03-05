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

describe("PATCH /api/v1/task/id", () => {
  test("Should return Unauthorized if no have token", async () => {
    await api
      .patch("/api/v1/task/")
      .expect(401)
      .expect("Content-type", /application\/json/);
  });

  test("Should return not found if task id not exist", async () => {
    const task = await createTasks(authValues.userId);
    await api
      .patch(`/api/v1/task/`)
      .set("Authorization", `Bearer ${authValues.token}`)
      .send({ createdBy: authValues.userId })
      .expect(404);
  });

  test("Should return ok", async () => {
    const task = await createTasks(authValues.userId);
    await api
      .patch(`/api/v1/task/${task[0]._id}`)
      .set("Authorization", `Bearer ${authValues.token}`)
      .send({ createdBy: authValues.userId })
      .expect(200);
  });
});

afterAll(() => {
  afterAllTests();
});
