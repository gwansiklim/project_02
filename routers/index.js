const express = require("express");
const Joi = require("joi");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const Write = require("../schemas/write");
const Comment = require("../schemas/comment");
const authmiddlewares = require("../middlewares/middlewares");
const router = express.Router();

const postUserSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmpassword: Joi.ref("password"),
});

//회원 가입.
router.post("/users", async (req, res) => {
  try {
    const { nickname, password, confirmpassword } =
      await postUserSchema.validateAsync(req.body);
    if (password !== confirmpassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }
    const exisUser = await User.find({
      $or: [{ nickname }],
    });
    if (exisUser.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 아아디 입니다.",
      });
      return;
    }
    const User = new User({ nickname, password });
    await User.save();

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 정보가 올바르지 않습니다.",
    });
  }
});

const postloginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});
// 로그인
router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = await postloginSchema.validateAsync(
      req.body
    );
    const user = await User.findOne({ nickname, password }).exec;

    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못되었습니다.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, "llikealcohol");
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
router.post("/add/write", authmiddlewares, async (req, res) => {
  const { title, write } = req.body;
  console.log(req.body);
  const user = res.locals.user;
  await Write.create({ title: title, write: write, nickname: user });
  res.send({ result: "success" });
});
// 메인페이지에 게시글 가져오기
router.get("/get/write", async (req, res) => {
  const posts = await Write.find().sort("-time");
  res.json(posts);
});

module.exports = router;
