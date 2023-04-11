const { loginController } = require("../controllers/usersController");
const jwt = require("jsonwebtoken");
const { User } = require("../db/userModel");
const bcrypt = require("bcryptjs");

describe("User Login", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("Should return User and token", async () => {
    process.env.SECRET_JWT = "SomeSecretWords";
    const requestBody = {
      email: "test@google.com",
      password: "testtest",
    };
    const user = {
      _id: {
        $oid: "63fa259fd13dbfbacfe99325",
      },
      password: bcrypt.hashSync(requestBody.password, 8),
      email: requestBody.email,
      subscription: "starter",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhMjU5ZmQxM2RiZmJhY2ZlOTkzMjUiLCJpYXQiOjE2NzczMzgwMzF9.YdjW3grEDPy8f2k-X8GWOnK9IvL8TNMQvUSp-z665Ek",
      avatarURL: "/avatars/avatar-63fa259fd13dbfbacfe99325.png",
      __v: 0,
    };

    jest.spyOn(User, "findOne").mockImplementationOnce(async () => {
      return user;
    });
    jest.spyOn(User, "findOneAndUpdate").mockImplementationOnce(async () => {
      return user;
    });

    const mReq = { body: requestBody };
    const mRes = {
      body: null,
      status: jest.fn().mockReturnThis(),
      json: jest.fn((response) => (mRes.body = response)),
    };

    await loginController(mReq, mRes);
    const { status, body } = mRes;
    expect(status).toHaveBeenCalledWith(200);
    expect(jwt.verify(body.token, process.env.SECRET_JWT).userId).toEqual(
      user._id
    );
    expect(body.user).toEqual({
      email: requestBody.email,
      subscription: user.subscription,
    });
  });
});