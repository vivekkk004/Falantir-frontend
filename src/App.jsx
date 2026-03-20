import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <AppRoutes />
    </>
  )
}

export default App
