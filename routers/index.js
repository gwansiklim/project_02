const express = require("express");
const post = require("../schemas/user");
const jwt = require("jsonwebtoken");
const write = require("../schemas/write");
const Comment = require("../schemas/comment");

const router = express.Router();

// 메인 글작성 가져오기
// router.get("/post", async (req, res) => {
//   const posts = await post.find().sort("-time");
//   res.json(posts);
// });

// 데이터 베이스에 넣기(회원가입)
router.post("/post", async (req, res) => {
  const { nickname, email, password, confirmpassword } = req.body;
  const sameUser = await post.find({
    $or: [{ nickname }, { email }],
  });
  if (sameUser.length) {
    res.status(400).send({
      errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
    });
    return;
  }
  if (!/[a-za-z0-9]+/.test(nickname) || nickname.length < 3) {
    res.status(400).send({
      errorMessage:
        "닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.",
    });
    return;
  }
  if (password.includes(nickname) || password.length < 4) {
    res.status(400).send({
      errorMessage: "비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.",
    });
    return;
  }
  if (password !== confirmpassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  const users = new post({
    nickname,
    email,
    password,
  });
  await users.save();
  res.status(200).send({});
});

//로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await post.findOne({ email, password });

  if (!user) {
    res.send({
      errorMessage: "이메일 또는 패스워드가 잘못되었습니다.",
    });
    return;
  }

  const token = jwt.sign({ nickname: post.nickname }, "llikealcohol");
  console.log(token);
  res.send({
    token,
  });
});

// 게시글 작성요청.
router.post("/detail", async (req, res) => {
  const { title, write } = req.body;
  await Comment.create({ title: title, write: write });
  res.send({ result: "success" });
});

// 목록가져오기.
router.get("/post", async (req, res) => {
  const comment = await Comment.find().sort("-date");
  // console.log(comment);
  res.json(comment);
});

module.exports = router;
