import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request){
  const s=getSession(); if(!s) return NextResponse.json({error:'unauth'},{status:401})
  const form=await req.formData(); const orderId=String(form.get('orderId')); const targetCourierId=form.get('courierId') as string | null
  let courierId=s.userId; if(s.role==='MANAGER' && targetCourierId) courierId=targetCourierId
  if(!orderId) return NextResponse.json({error:'orderId required'},{status:400})
  const order=await prisma.order.findUnique({ where:{ id:orderId } }); if(!order) return NextResponse.json({error:'not found'},{status:404})
  if(order.status!=='NEW') return NextResponse.json({error:'already assigned'},{status:400})
  await prisma.assignment.create({ data:{ orderId, courierId, assignedById:s.userId } })
  await prisma.order.update({ where:{ id:orderId }, data:{ status:'ASSIGNED' } })
  return NextResponse.redirect(new URL('/map', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
}
