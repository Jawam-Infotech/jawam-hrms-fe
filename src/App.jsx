import AppRoutes from './routes/AppRoutes.jsx'
import { UserProvider } from './context/UserContext.jsx'

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
