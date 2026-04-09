import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { BooksProvider } from './contexts/BooksContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <BooksProvider>
            <CartProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors />
            </CartProvider>
          </BooksProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
