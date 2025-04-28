import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Afetto - Móveis sob medida que contam sua história',
  description: 'Móveis personalizados de alta qualidade, projetados e fabricados artesanalmente para transformar sua casa em um lar único.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}