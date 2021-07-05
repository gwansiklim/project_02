const express = require("express");
const post = require("../schemas/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 메인 글작성 가져오기
// router.get("/post", async (req, res) => {
//   const posts = await post.find().sort("-time");
//   res.json(posts);
// });

// 데이터 베이스에 넣기
router.post("/post", async (req, res) => {
  const { nickname, email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  const sameUser = await post.find({
    $or: [{ nickname }, { email }],
  });
  if (sameUser.length) {
    res.status(400).send({
      errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
    });
    return;
  }
  const user = new post({ nickname, email, password });

  await user.save();

  res.status(200).send({});
});

module.exports = router;
