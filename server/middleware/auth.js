import { verifyToken } from '../utils/jwt.js'
import { env } from '../config/env.js'

export const requireAuth = (req, res, next) => {
  const token = req.cookies[env.cookieName]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No session' })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    res.clearCookie(env.cookieName)
    return res.status(401).json({ error: 'Session expired or invalid' })
  }
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' })
    }
    next()
  }
}