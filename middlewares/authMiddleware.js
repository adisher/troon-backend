const { sign, verify } = require("jsonwebtoken");
const { signup } = require("../beans/common");
const {
  usersController,
  adminController,
  clientController,
} = require("../controllers");

const executeLogin = async (username, password, cb) => {
  try {
    const filter = { userName: username, password: password };
    const user = await usersController.getUser(filter);
    if (!user) {
      return cb(null, false);
    }

    return cb(null, user);
  } catch (error) {
    return cb(error, false);
  }
};
const generateToken = async (req, res, next) => {
  const user = req.user;

  const json = {
    _id: user._id,
  };
  const token = sign({ user: json }, "someSecretvalue", { expiresIn: "1h" });
  req.token = token;
  next();
};
const respond = async (req, res, next) => {
  const user = req.user;
  /*
    const userType = user.userType.kind;
    const item = user.userType.item;
    let data = null;
    if (userType === 'admin') {
        data = await adminController.getAdmin({ _id: item });
    }
    if (userType === 'client') {
        data = await clientController.getClient({ _id: item });
    }
   const result = { token: req.token, user: data };
    res.status(200).send(result);
    */
  const result = { token: req.token, user: user.userType };
  res.status(200).send(result);
};
const userSignup = async (req, res, next) => {
  const body = req.body;
  try {
    const result = await signup(body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).send(error);
  }
};

function verifyToken(req, res, next) {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  } else {
    return res
      .status(401)
      .json({ success: false, error: "Please provide token." });
  }
  verify(token, "someSecretvalue", async (error, decoded) => {
    console.log(error, decoded);
    if (error) {
      const { name } = error;
      switch (name) {
        case "JsonWebTokenError":
          return res
            .status(401)
            .json({ success: false, error: "Request Access Denied!" });
          break;
        case "TokenExpiredError":
          return res
            .status(401)
            .json({ success: false, error: "Your session has been expired!" });
          break;
        default:
          return res
            .status(401)
            .json({ success: false, error: "unhandled authentication case!" });
      }
    } else {
      const userID = decoded?.user?._id;
      try {
        let user = await usersController.getUser({ _id: userID });
        if (user === null) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid token" });
        }
        req.user = user;
        next();
      } catch (err) {
        res.status(401).send(err);
      }
    }
  });
}

function checkClientPermissions(req, res, next) {
  const userType = req.user.userType.kind;
  if (userType === "client") {
    next();
  } else {
    return res
      .status(401)
      .send({ message: "You do not have permissions to access this" });
  }
}

function checkAdminPermissions(req, res, next) {
  const userType = req.user.userType.kind;
  if (userType === "admin") {
    next();
  } else {
    return res
      .status(401)
      .send({ message: "You do not have permissions to access this" });
  }
}

module.exports = {
  userSignup,
  executeLogin,
  generateToken,
  respond,
  verifyToken,
  checkAdminPermissions,
  checkClientPermissions,
};
