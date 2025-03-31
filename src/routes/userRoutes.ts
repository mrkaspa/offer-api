import { Router } from "express"
import { UserController } from "@/controllers/UserController"

const router = Router()
const userController = new UserController()

// GET all users
router.get("/", userController.getAllUsers)

// GET single user
router.get("/:id", userController.getUserById)

// POST new user
router.post("/", userController.createUser)

// PUT update user
router.put("/:id", userController.updateUser)

// DELETE user
router.delete("/:id", userController.deleteUser)

export default router
