import { Request, Response, NextFunction } from "express"
import { UserController } from "@/controllers/UserController"
import { AppDataSource } from "@/config/database"
import { User } from "@/entities/User"

// Mock the TypeORM repository
jest.mock("@/config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}))

describe("UserController", () => {
  let userController: UserController
  let mockRepository: any
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Create mock repository
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    // Setup repository mock
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository)

    // Create controller instance
    userController = new UserController()

    // Setup mock request and response
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
  })

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
        },
      ]

      mockRepository.find.mockResolvedValue(mockUsers)

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockRepository.find).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers)
    })

    it("should handle errors", async () => {
      const error = new Error("Database error")
      mockRepository.find.mockRejectedValue(error)

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      const mockUser = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockResolvedValue(mockUser)

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      })
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser)
    })

    it("should return 404 when user not found", async () => {
      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockResolvedValue(null)

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      })
    })

    it("should handle errors", async () => {
      const error = new Error("Database error")
      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockRejectedValue(error)

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      const createdUser = {
        id: "1",
        ...mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRequest.body = mockUser
      mockRepository.create.mockReturnValue(mockUser)
      mockRepository.save.mockResolvedValue(createdUser)

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockRepository.create).toHaveBeenCalledWith(mockUser)
      expect(mockRepository.save).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(createdUser)
    })

    it("should handle errors", async () => {
      const error = new Error("Database error")
      mockRequest.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }
      // This should not fail but it does because of the jest library
      // mockRepository.create.mockRejectedValue("Database error");
      mockRepository.create = jest.fn(() => {
        throw error
      })

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe("updateUser", () => {
    it("should update an existing user", async () => {
      const mockUser = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      const updateData = {
        firstName: "Johnny",
      }

      mockRequest.params = { id: "1" }
      mockRequest.body = updateData
      mockRepository.findOne.mockResolvedValue(mockUser)
      mockRepository.merge.mockReturnValue({ ...mockUser, ...updateData })
      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateData })

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      })
      expect(mockRepository.merge).toHaveBeenCalled()
      expect(mockRepository.save).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...mockUser,
        ...updateData,
      })
    })

    it("should return 404 when user not found", async () => {
      mockRequest.params = { id: "1" }
      mockRequest.body = { firstName: "Johnny" }
      mockRepository.findOne.mockResolvedValue(null)

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      })
    })

    it("should handle errors", async () => {
      const error = new Error("Database error")
      mockRequest.params = { id: "1" }
      mockRequest.body = { firstName: "Johnny" }
      mockRepository.findOne.mockRejectedValue(error)

      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      const mockUser = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      }

      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockResolvedValue(mockUser)
      mockRepository.remove.mockResolvedValue(mockUser)

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      })
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser)
      expect(mockResponse.status).toHaveBeenCalledWith(204)
      expect(mockResponse.send).toHaveBeenCalled()
    })

    it("should return 404 when user not found", async () => {
      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockResolvedValue(null)

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      })
    })

    it("should handle errors", async () => {
      const error = new Error("Database error")
      mockRequest.params = { id: "1" }
      mockRepository.findOne.mockRejectedValue(error)

      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalledWith(error)
    })
  })
})
