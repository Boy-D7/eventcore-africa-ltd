import './globals.css'

export const metadata = {
  title: 'EventCore Africa · Secure Digital Ticketing',
  description: 'Zero-cash ticketing ecosystem for Malawi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
