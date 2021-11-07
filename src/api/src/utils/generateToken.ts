import jwt from 'jsonwebtoken'

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === 'production' ? '3d' : '30d'
  })
}
export default generateToken;
