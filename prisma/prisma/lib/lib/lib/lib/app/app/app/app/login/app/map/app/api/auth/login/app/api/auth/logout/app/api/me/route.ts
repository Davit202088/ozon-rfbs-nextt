import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
export async function GET(){ const s=getSession(); return NextResponse.json({ role:s?.role ?? 'COURIER', email:s?.email ?? null }) }
