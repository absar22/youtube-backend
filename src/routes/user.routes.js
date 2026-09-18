import { Router } from "express"
import { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(upload.fields([{
    name: 'avatar',    // name should be same in frontend
    maxCount: 1
},{
    name:'coverImage',
    maxCount: 1
}]) ,registerUser)

router.route('/login').post(loginUser)

// protected routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refreshToken').post(refreshAccessToken)
router.route('/change-password').patch(verifyJWT,changeCurrentPassword)
router.route('/current-user').get(verifyJWT, getCurrentUser)

export default router