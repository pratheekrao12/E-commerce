import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import StockBadge from "../components/StockBadge";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const loadProducts = useCallback(async () => {
        try {
            const data = await apiGet("/admin/dashboard");
            setError("");
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            if (err.status === 401 || err.status === 403) {
                navigate("/products", { replace: true });
                return;
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        let active = true;
        apiGet("/admin/dashboard")
            .then((data) => {
                if (!active) return;
                setError("");
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                if (!active) return;
                if (err.status === 401 || err.status === 403) {
                    navigate("/products", { replace: true });
                    return;
                }
                setError(err.message);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [navigate]);

    async function handleDelete(id) {
        if (!window.confirm("Delete this product?")) return;
        setError("");
        setDeletingId(id);
        try {
            await apiPost("/admin/products/delete", { id });
            await loadProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="container">
            <div className="page-header">
                <h2>Admin Dashboard</h2>
                <div className="page-actions">
                    <Link className="btn" to="/admin/products/new">
                        + Add New Product
                    </Link>
                    <Link className="btn btn-outline" to="/products">
                        View Storefront
                    </Link>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <p>No products yet. Add your first product to get started.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>
                                        <strong>{p.name}</strong>
                                    </td>
                                    <td>₹{p.price}</td>
                                    <td>
                                        <StockBadge stock={p.stock} />
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <Link
                                                className="btn btn-outline btn-sm"
                                                to={`/admin/products/edit/${p.id}`}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                disabled={deletingId === p.id}
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                {deletingId === p.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
