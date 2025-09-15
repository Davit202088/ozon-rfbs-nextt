import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { login } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request){
  const { email, password } = await req.json()
  const managerEmail='manager@example.com', courierEmail='courier@example.com'
  const pwd1=await bcrypt.hash('manager123',10), pwd2=await bcrypt.hash('courier123',10)
  await prisma.user.upsert({ where:{ email:managerEmail }, update:{}, create:{ email:managerEmail, passwordHash:pwd1, role:'MANAGER', name:'Менеджер' } })
  await prisma.user.upsert({ where:{ email:courierEmail }, update:{}, create:{ email:courierEmail, passwordHash:pwd2, role:'COURIER', name:'Курьер' } })
  const ok = await login(email, password)
  if(!ok) return NextResponse.json({error:'invalid'},{status:401})
  return NextResponse.json({ ok: true })
}
