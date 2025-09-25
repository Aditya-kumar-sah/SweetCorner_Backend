const {Router} = require("express");
const { createUser, loginUser } = require("../controller/user.controller");

const router = Router();

router.post("/auth/register",createUser);
router.post("/auth/login",loginUser);

module.exports = router