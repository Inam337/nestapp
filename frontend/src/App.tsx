import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { CustomersList } from "./components/CustomersList";
import { CustomerForm } from "./components/CustomerForm";
import { PrivateRoute } from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/:id/edit"
            element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
