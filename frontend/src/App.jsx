import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products/new"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminProductFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminProductFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
