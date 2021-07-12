const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const Write = require("../schemas/write");
const Comment = require("../schemas/comment");
const middleware = require("../middlewares/middlewares");
const router = express.Router();

//회원 가입.
router.post("/users", async (req, res) => {
  const { nickname, password, confirmpassword } = req.body;

  const exists = await User.findOne({ nickname });
  if (exists) {
    res.statusCode = 400;
    res.send(`중복된 닉네임입니다.`);
    return;
  }
  // 닉네임 검증 reg
  if (!/[a-zA-Z0-9]+/.test(nickname) || nickname.length < 3) {
    res.statusCode = 400;
    res.send(
      `닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.`
    );
    return;
  }

  // 패스워드 검증
  if (password.includes(nickname) || password.length < 4) {
    res.statusCode = 400;
    res.send(`비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.`);
    return;
  }

  // 두 패스워다가 같은지 검사
  if (password !== confirmpassword) {
    res.statusCode = 400;
    res.send(`비밀번호가 일치하지 않습니다.`);
    return;
  }

  // 모든 검사가 통과 한 후에
  const user = new User({
    nickname,
    password,
  });

  //유저를 저장, statusCode 성공 리턴
  await user.save();
  res.statusCode = 200;
  res.send();
});

// const postloginSchema = Joi.object({
//   nickname: Joi.string().required(),
//   password: Joi.string().required(),
// });
// 로그인
router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ nickname, password });
    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못되었습니다.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.nickname }, "lim-gwan-sik");
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 정보가 올바르지 않습니다.",
    });
  }
});

//게시글 작성
router.post("/writes", middleware, async (req, res) => {
  const { title, write } = req.body;
  const user = res.locals.user;
  console.log(user, title, write);
  await Write.create({
    title: title,
    write: write,
    nickname: user,
  });
  res.send({ result: "success" });
});

// 메인페이지에 게시글 가져오기
router.get("/get/write", async (req, res) => {
  const posts = await Write.find().sort("-time");
  res.json(posts);
});

// 게시글 상세페이지
router.get("/detail/:_id", async (req, res) => {
  const { _id } = req.params;
  const post = await Write.findOne({ _id });
  res.render("detail", { post });
});

// 수정페이지
router.get("/editpost/:_id", middleware, async (req, res) => {
  const { _id } = req.params;
  const post = await Write.findOne({ _id });
  res.render("editpost", { post });
});

// 수정하기
router.put("/editpost/:_id", middleware, async (req, res) => {
  console.log(req);
  const { title, write } = req.body;
  const { _id } = req.params;
  await Write.updateOne({ _id }, { $set: { title: title, write: write } });
  res.json({ msg: "수정 되었습니다." });
});

router.delete("/editpost/:_id", middleware, async (req, res) => {
  const { _id } = req.params;
  await Write.deleteOne({ _id });
  res.json({ msg: "삭제 되었습니다." });
});

module.exports = router;
