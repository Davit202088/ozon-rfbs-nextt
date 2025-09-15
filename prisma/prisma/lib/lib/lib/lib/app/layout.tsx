import './globals.css'
export const metadata = { title: 'Ozon rFBS Курьер', description: 'Карта заказов' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ru"><body>{children}</body></html>)
}
