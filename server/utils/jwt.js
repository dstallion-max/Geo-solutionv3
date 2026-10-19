import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.full_name },
    env.jwtSecret,
    { expiresIn: env.jwtExpires }
  )
}

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret)
}