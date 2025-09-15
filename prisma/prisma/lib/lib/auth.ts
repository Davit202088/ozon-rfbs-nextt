import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const COOKIE = 'auth_token'
export type JWTPayload = { userId: string, role: 'MANAGER'|'COURIER', email: string }

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' })
  return { token, user }
}

export function logout() { cookies().set(COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' }) }

export function getSession(): JWTPayload | null {
  const token = cookies().get(COOKIE)?.value
  if (!token) return null
  try { return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload } catch { return null }
