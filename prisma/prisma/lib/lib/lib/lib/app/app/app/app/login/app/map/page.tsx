'use client'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
const MapContainer = dynamic(()=>import('react-leaflet').then(m=>m.MapContainer),{ssr:false})
const TileLayer = dynamic(()=>import('react-leaflet').then(m=>m.TileLayer),{ssr:false})
const Marker = dynamic(()=>import('react-leaflet').then(m=>m.Marker),{ssr:false})
const Popup = dynamic(()=>import('react-leaflet').then(m=>m.Popup),{ssr:false})

type Order={id:string,title:string,lat:number,lng:number,address:string,deliveryDate?:string,phoneMasked?:string,priceRub?:number,postingNumber:string,article?:string}
export default function MapPage(){
  const [orders,setOrders]=useState<Order[]>([]); const [role,setRole]=useState<'MANAGER'|'COURIER'>('COURIER')
  useEffect(()=>{fetch('/api/me').then(r=>r.json()).then(d=>setRole(d.role)); fetch('/api/orders').then(r=>r.json()).then(setOrders)},[])
  const pos=useMemo(()=>({lat:52.3731,lng:4.8922}),[])
  return (<div><header><div className="toolbar"><strong>Карта заказов</strong><span className="badge">{role==='MANAGER'?'Менеджер':'Курьер'}</span></div><div className="toolbar"><a href="/api/auth/logout"><button>Выйти</button></a></div></header>
    <div className="mapwrap"><MapContainer center={pos} zoom={12} style={{height:'100%',width:'100%'}}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {orders.map(o=>(<Marker key={o.id} position={{lat:o.lat,lng:o.lng}}><Popup><div style={{minWidth:240}}>
        <strong>{o.title}</strong><div>{o.address}</div>{o.deliveryDate&&<div>Доставка: {new Date(o.deliveryDate).toLocaleString()}</div>}<div>Телефон: {o.phoneMasked??'—'}</div>{role==='MANAGER'&&<div>Стоимость: {o.priceRub?`${o.priceRub} ₽`:'—'}</div>}
        {role==='MANAGER'&&<form method="POST" action="/api/assignments"><input type="hidden" name="orderId" value={o.id}/><button type="submit" style={{marginTop:8}}>Назначить мне</button></form>}
      </div></Popup></Marker>))}
    </MapContainer></div></div>) }
