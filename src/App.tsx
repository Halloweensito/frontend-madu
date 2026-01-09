
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes/AppRoutes.tsx';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster richColors position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
