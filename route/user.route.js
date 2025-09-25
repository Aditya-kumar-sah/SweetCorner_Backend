const {Router} = require("express");
const { createUser, loginUser,getUser, logoutUser } = require("../controller/user.controller");
const { UserAuth } = require("../middleware/auth.middleware");

const router = Router();

router.post("/auth/register",createUser);
router.post("/auth/login",loginUser);
router.get("/auth/getUserData",UserAuth,getUser);
router.post("/auth/logout",UserAuth, logoutUser);

module.exports = router