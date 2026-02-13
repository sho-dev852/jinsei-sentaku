import './globals.css'

export const metadata = {
  title: '人生の選択 投票サイト',
  description: '匿名で人生の選択を投稿し、他人が投票できるサイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}