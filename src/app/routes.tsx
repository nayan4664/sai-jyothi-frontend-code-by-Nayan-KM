import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { Books } from './pages/Books';
import { BookDetail } from './pages/BookDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { InfoPage } from './pages/InfoPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { CustomerSupport } from './pages/CustomerSupport';
import { Events } from './pages/Events';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export const router = createBrowserRouter([
  { path: '/', element: <Layout><Home /></Layout> },
  { path: '/books', element: <Layout><Books /></Layout> },
  { path: '/customer-support', element: <Layout><CustomerSupport /></Layout> },
  { path: '/events', element: <Layout><Events /></Layout> },
  { path: '/book/:id', element: <Layout><BookDetail /></Layout> },
  { path: '/cart', element: <Layout><Cart /></Layout> },
  {
    path: '/checkout',
    element: (
      <Layout>
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/order-success',
    element: (
      <Layout>
        <ProtectedRoute>
          <OrderSuccess />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/orders',
    element: (
      <Layout>
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/admin',
    element: (
      <Layout>
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Layout>
    ),
  },
  { path: '/login', element: <Login /> },
  { path: '/about', element: <Layout><InfoPage translationKey="about" /></Layout> },
  { path: '/faq', element: <Layout><InfoPage translationKey="faq" /></Layout> },
  { path: '/shipping-returns', element: <Layout><InfoPage translationKey="shipping" /></Layout> },
  { path: '/privacy-policy', element: <Layout><InfoPage translationKey="privacy" /></Layout> },
  { path: '/terms-conditions', element: <Layout><InfoPage translationKey="terms" /></Layout> },
]);
