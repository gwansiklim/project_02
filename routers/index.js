const express = require("express");
const Joi = require("joi");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const Write = require("../schemas/write");
const Comment = require("../schemas/comment");
const middleware = require("../middlewares/middlewares");
const router = express.Router();

const postUserSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmpassword: Joi.ref("password"),
});

//회원 가입.

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
    const user = await Post.findOne({ nickname, password }).exec;

    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못되었습니다.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, "im-gwan-sik");
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
  await Write.create({
    title: title,
    write: write,
    nickname: user.nickname,
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
router.get("/editpost/:_id", async (req, res) => {
  const { _id } = req.params;
  const post = await Write.findOne({ _id });
  res.render("editpost", { post });
});

// 수정하기
router.put("/editpost/:_id", async (req, res) => {
  const { title, write } = req.body;
  const { _id } = req.params;
  console.log(title, write, _id);
  await Write.updateOne({ _id }, { $set: { title: title, write: write } });
  res.json({ msg: "수정 되었습니다." });
});

module.exports = router;
