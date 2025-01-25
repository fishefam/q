import './globals.css'

export default function Layout({ children }: LayoutProperties) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
