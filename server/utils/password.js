import bcrypt from 'bcryptjs'

export const hashPin = async (pin) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(pin, salt)
}

export const verifyPin = async (pin, hash) => {
  return bcrypt.compare(pin, hash)
}