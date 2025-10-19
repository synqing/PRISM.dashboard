export const metadata = { title: "PRISM.dashboard" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh" style={{ background: '#0B0D12', color: '#e5e7eb' }}>
        {children}
      </body>
    </html>
  );
}
