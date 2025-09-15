import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { listFbsPostings } from '@/lib/ozon'
import { titleFromPosting } from '@/lib/utils'

async function ensureOrders(){
  const data = await listFbsPostings(new Date(Date.now()-7*86400000).toISOString())
  const postings = data.result?.postings ?? data
  for (const p of postings){
    const postingNumber=p.posting_number
    const article=p.products?.[0]?.offer_id ?? p.analytics_data?.sku
    const address=p.customer?.address?.address_tail ?? 'Amsterdam'
    const phoneMasked=p.customer?.phone
    const price=p.financial_data?.posting_services?.marketplace_service_item_fulfillment?.price ?? null
    const deliveryDate=p.delivering_date ? new Date(p.delivering_date) : null
    await prisma.order.upsert({
      where:{ ozonPostingNumber: postingNumber },
      update:{ article, buyerAddressRaw: address, phoneMasked, deliveryPriceRub: price ?? undefined, deliveryDate: deliveryDate ?? undefined },
      create:{ ozonPostingNumber: postingNumber, ozonOrderId: p.order_id ?? null, deliverySchema:'RFBS', sku:p.analytics_data?.sku ?? null, article, buyerAddressRaw: address, lat:52.3731+Math.random()*0.05, lng:4.8922+Math.random()*0.05, phoneMasked, deliveryPriceRub: price ?? null, deliveryDate: deliveryDate ?? null, status:'NEW' }
    })
  }
}

export async function GET(){
  await ensureOrders()
  const orders = await prisma.order.findMany({ orderBy:{ createdAt:'desc' }, take:200 })
  const result = orders.map(o=>({ id:o.id, title:titleFromPosting(o.ozonPostingNumber, o.article ?? undefined), lat:o.lat ?? 52.3731, lng:o.lng ?? 4.8922, address:o.buyerAddressRaw, deliveryDate:o.deliveryDate?.toISOString(), phoneMasked:o.phoneMasked ?? undefined, priceRub:o.deliveryPriceRub ?? undefined, postingNumber:o.ozonPostingNumber, article:o.article ?? undefined }))
  return NextResponse.json(result)
}
