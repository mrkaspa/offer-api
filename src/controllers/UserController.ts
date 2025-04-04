import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '@/config/database'
import { User } from '@/entities/User'
import jwt from 'jsonwebtoken'

export class UserController {
  private userRepository = AppDataSource.getRepository(User)

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userRepository.find()
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.params.id },
      })

      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { firstName, lastName, email, password } = req.body

      const user = await this.userRepository.create({
        firstName,
        lastName,
        email,
        password,
      })

      const createdUser = await this.userRepository.save(user)
      res.status(201).json(createdUser)
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.params.id },
      })

      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      this.userRepository.merge(user, req.body)
      const results = await this.userRepository.save(user)

      res.json(results)
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.params.id },
      })

      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      await this.userRepository.remove(user)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body

      const user = await this.userRepository.findOne({
        where: { email },
      })

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'testsecret', {
        expiresIn: '1h',
      })
      res.json({ token })
    } catch (error) {
      next(error)
    }
  }
}
