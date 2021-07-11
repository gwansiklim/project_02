const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  console.log(tokenValue, tokenType);

  if (tokenType !== "Bearer") {
    res.status(401).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, "limgwansik");
    console.log(userId);
    // const foundUser = await User.findOne({ nickname: nickname });
    User.findByPk({ userId }).then((user) => {
      console.log(user);
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
};
