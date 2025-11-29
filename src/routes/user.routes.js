const { Router } = require("express");
const registerUser = require("../controllers/user.controller");
const upload = require("../middlewares/multer");
const verifyJWT = require("../middlewares/auth");
const router= Router();

router.route("/register").post(
    upload.fields([
    {
        name : "avatar",
        maxCount : 1,
    },
    {
        name : "coverImage",
        maxCount: 1
    }
]
), registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("refresh-token").post(refreshAccessToken)



module.exports = router;



