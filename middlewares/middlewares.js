const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
  try {
    const { nickname } = jwt.verify(tokenValue, "im-gwan-sik");
    // console.log(nickname);
    const foundUser = await User.findOne({ nickname: nickname });
    User.findOne({ nickname: nickname }).then((user) => {
      // res.locals.user = user;
      // console.log(res.locals);
      next();
    });
  } catch (error) {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
};
