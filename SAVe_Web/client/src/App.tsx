import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import NewCaseChoice from './pages/NewCaseChoice';
import UserManagement from './pages/UserManagement';
import ChangePassword from './pages/ChangePassword';

// Case form pages
import DadosEntrada from './pages/cases/DadosEntrada';
import Identificacao from './pages/cases/Identificacao';
import SituacaoJuridica from './pages/cases/SituacaoJuridica';
import Saude from './pages/cases/Saude';
import HabitacaoTerritorio from './pages/cases/HabitacaoTerritorio';
import Assistencia from './pages/cases/Assistencia';
import EnsinoTrabalhoRenda from './pages/cases/EnsinoTrabalhoRenda';
import Vinculos from './pages/cases/Vinculos';
import ProtecaoSeguranca from './pages/cases/ProtecaoSeguranca';
import Agressor from './pages/cases/Agressor';
import Vitimizacao from './pages/cases/Vitimizacao';
import SinteseAnalitica from './pages/cases/SinteseAnalitica';
import MatrizRisco from './pages/cases/MatrizRisco';
import Acompanhamentos from './pages/cases/Acompanhamentos';
import Referencias from './pages/cases/Referencias';
import Encerramento from './pages/cases/Encerramento';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return token ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/cases" element={
        <PrivateRoute>
          <CasesList />
        </PrivateRoute>
      } />

      <Route path="/cases/new" element={
        <PrivateRoute>
          <NewCaseChoice />
        </PrivateRoute>
      } />

      <Route path="/users" element={
        <PrivateRoute>
          <UserManagement />
        </PrivateRoute>
      } />

      <Route path="/change-password" element={
        <PrivateRoute>
          <ChangePassword />
        </PrivateRoute>
      } />

      {/* Versão Completa Routes */}
      <Route path="/cases/new/completa/dados-entrada" element={<PrivateRoute><DadosEntrada /></PrivateRoute>} />
      <Route path="/cases/new/completa/identificacao" element={<PrivateRoute><Identificacao /></PrivateRoute>} />
      <Route path="/cases/new/completa/situacao-juridica" element={<PrivateRoute><SituacaoJuridica /></PrivateRoute>} />
      <Route path="/cases/new/completa/saude" element={<PrivateRoute><Saude /></PrivateRoute>} />
      <Route path="/cases/new/completa/habitacao" element={<PrivateRoute><HabitacaoTerritorio /></PrivateRoute>} />
      <Route path="/cases/new/completa/assistencia" element={<PrivateRoute><Assistencia /></PrivateRoute>} />
      <Route path="/cases/new/completa/ensino" element={<PrivateRoute><EnsinoTrabalhoRenda /></PrivateRoute>} />
      <Route path="/cases/new/completa/vinculos" element={<PrivateRoute><Vinculos /></PrivateRoute>} />
      <Route path="/cases/new/completa/protecao" element={<PrivateRoute><ProtecaoSeguranca /></PrivateRoute>} />
      <Route path="/cases/new/completa/agressor" element={<PrivateRoute><Agressor /></PrivateRoute>} />
      <Route path="/cases/new/completa/vitimizacao" element={<PrivateRoute><Vitimizacao /></PrivateRoute>} />
      <Route path="/cases/new/completa/sintese" element={<PrivateRoute><SinteseAnalitica /></PrivateRoute>} />
      <Route path="/cases/new/completa/matriz-risco" element={<PrivateRoute><MatrizRisco /></PrivateRoute>} />
      <Route path="/cases/new/completa/acompanhamentos" element={<PrivateRoute><Acompanhamentos /></PrivateRoute>} />
      <Route path="/cases/new/completa/referencias" element={<PrivateRoute><Referencias /></PrivateRoute>} />
      <Route path="/cases/new/completa/encerramento" element={<PrivateRoute><Encerramento /></PrivateRoute>} />

      {/* Versão Breve Routes */}
      <Route path="/cases/new/breve/dados-entrada" element={<PrivateRoute><DadosEntrada /></PrivateRoute>} />
      <Route path="/cases/new/breve/identificacao" element={<PrivateRoute><Identificacao /></PrivateRoute>} />
      <Route path="/cases/new/breve/situacao-juridica" element={<PrivateRoute><SituacaoJuridica /></PrivateRoute>} />
      <Route path="/cases/new/breve/protecao" element={<PrivateRoute><ProtecaoSeguranca /></PrivateRoute>} />

      {/* Edit case routes (with ID) */}
      <Route path="/cases/:id/dados-entrada" element={<PrivateRoute><DadosEntrada /></PrivateRoute>} />
      <Route path="/cases/:id/identificacao" element={<PrivateRoute><Identificacao /></PrivateRoute>} />
      <Route path="/cases/:id/situacao-juridica" element={<PrivateRoute><SituacaoJuridica /></PrivateRoute>} />
      <Route path="/cases/:id/saude" element={<PrivateRoute><Saude /></PrivateRoute>} />
      <Route path="/cases/:id/habitacao" element={<PrivateRoute><HabitacaoTerritorio /></PrivateRoute>} />
      <Route path="/cases/:id/assistencia" element={<PrivateRoute><Assistencia /></PrivateRoute>} />
      <Route path="/cases/:id/ensino" element={<PrivateRoute><EnsinoTrabalhoRenda /></PrivateRoute>} />
      <Route path="/cases/:id/vinculos" element={<PrivateRoute><Vinculos /></PrivateRoute>} />
      <Route path="/cases/:id/protecao" element={<PrivateRoute><ProtecaoSeguranca /></PrivateRoute>} />
      <Route path="/cases/:id/agressor" element={<PrivateRoute><Agressor /></PrivateRoute>} />
      <Route path="/cases/:id/vitimizacao" element={<PrivateRoute><Vitimizacao /></PrivateRoute>} />
      <Route path="/cases/:id/sintese" element={<PrivateRoute><SinteseAnalitica /></PrivateRoute>} />
      <Route path="/cases/:id/matriz-risco" element={<PrivateRoute><MatrizRisco /></PrivateRoute>} />
      <Route path="/cases/:id/acompanhamentos" element={<PrivateRoute><Acompanhamentos /></PrivateRoute>} />
      <Route path="/cases/:id/referencias" element={<PrivateRoute><Referencias /></PrivateRoute>} />
      <Route path="/cases/:id/encerramento" element={<PrivateRoute><Encerramento /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
