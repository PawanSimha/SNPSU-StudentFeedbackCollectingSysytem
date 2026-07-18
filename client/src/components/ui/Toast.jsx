import { Toaster } from 'sonner';

const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      className: 'sonner-toast',
      style: {
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.88rem',
        borderRadius: '10px',
        border: '1px solid var(--gray-200)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      },
    }}
  />
);

export default ToastProvider;
