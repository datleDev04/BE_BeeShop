import express from "express"
import authRouter from "./auth.js"
import roleRouter from "./role.js"
import permissionRouter from "./permission.js"

const router = express.Router()

router.use("/auth", authRouter)
router.use("/role", roleRouter)
router.use("/permission", permissionRouter)


export default router