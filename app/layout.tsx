import './globals.css';

export const metadata = {
  title: 'Chat with your Workload',
  description: 'Chat with your AWS workload',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
