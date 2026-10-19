import { pool } from '../db/pool.js'
import { verifyPin } from '../utils/password.js'
import { generateToken, verifyToken } from '../utils/jwt.js'
import { env } from '../config/env.js'

export const login = async (req, res) => {
  const { email, pin } = req.body

  if (!email || !pin) {
    return res.status(400).json({ error: 'Email and PIN are required' })
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    const user = rows[0]

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await verifyPin(pin, user.pin_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user)
    const isProd = env.nodeEnv === 'production'

    res.cookie(env.cookieName, token, {
      httpOnly: true,
      secure: isProd, 
      sameSite: isProd ? 'none' : 'lax',
      partitioned: isProd, // CRITICAL: Allows cross-site cookies on Chrome/Brave
      maxAge: 24 * 60 * 60 * 1000,
      path: '/' 
    })

    res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role, name: user.full_name }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const logout = (req, res) => {
  const isProd = env.nodeEnv === 'production'
  
  // clearCookie MUST have the exact same flags as res.cookie
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    partitioned: isProd,
    path: '/'
  })
  res.json({ success: true, message: 'Logged out' })
}

export const checkSession = (req, res) => {
  const token = req.cookies[env.cookieName]
  if (!token) return res.json({ valid: false })

  try {
    const decoded = verifyToken(token) 
    res.json({ valid: true, user: decoded })
  } catch (err) {
    res.json({ valid: false })
  }
}