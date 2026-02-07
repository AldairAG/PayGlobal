import { Provider } from 'react-redux'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes/routes'
import LandingPage from './pages/LandingPage'
import { UserLayout } from './layout/UserLayout'
import { AdminLayout } from './layout/AdminLayout'
import { HomePage } from './pages/user/HomePage'
import { RetiroPage } from './pages/user/Retiro'
import { LicenciasPage } from './pages/user/LicenciasPage'
import { HistorialPage } from './pages/user/HisotrialPage'
import { ProfilePage } from './pages/user/ProfilePage'
import { SoportePage } from './pages/user/SoportePage'
import { TransferenciaInternaPage } from './pages/user/TransferenciaInternaPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { GestionPagosPage } from './pages/admin/GestionPagosPage'
import { GestionKycPage } from './pages/admin/GestionKycPage'
import { EditarUsuarioPage } from './pages/admin/EditarUsuarioPage'
import { ExploradorUsuarioPage } from './pages/admin/ExploradorUsuarioPage'
import { store } from './store'
import "./i18n";


function App() {

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />

            <Route path={ROUTES.USER.LAYOUT} element={<UserLayout />} >

              <Route path={ROUTES.USER.HOME} element={<HomePage />} />
              <Route path={ROUTES.USER.LICENCIAS} element={<LicenciasPage />} />
              <Route path={ROUTES.USER.RETIRO} element={<RetiroPage />} />
              <Route path={ROUTES.USER.HISTORIAL} element={<HistorialPage />} />
              <Route path={ROUTES.USER.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.USER.SOPORTE} element={<SoportePage />} />
              <Route path={ROUTES.USER.TRANSFERENCIA_INTERNA} element={<TransferenciaInternaPage />} />

            </Route>

            <Route path={ROUTES.ADMIN.LAYOUT} element={<AdminLayout />} >
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.ADMIN.GESTION_PAGOS} element={<GestionPagosPage />} />
              <Route path={ROUTES.ADMIN.GESTION_KYC} element={<GestionKycPage />} />
              <Route path={ROUTES.ADMIN.EDITAR_USUARIO} element={<EditarUsuarioPage />} />
              <Route path={ROUTES.ADMIN.USERS_EXPLORER} element={<ExploradorUsuarioPage />} />
            </Route>
          </Routes>

        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
