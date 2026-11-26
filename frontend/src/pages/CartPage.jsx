import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api";

export default function CartPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [error, setError] = useState("");

    const loadCart = useCallback(async () => {
        try {
            const data = await apiGet("/cart");
            setError("");
            setItems(Array.isArray(data?.items) ? data.items : []);
            setTotal(data?.total ?? 0);
        } catch (err) {
            if (err.status === 401) {
                navigate("/login", { replace: true });
                return;
            }
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        let active = true;
        apiGet("/cart")
            .then((data) => {
                if (!active) return;
                setError("");
                setItems(Array.isArray(data?.items) ? data.items : []);
                setTotal(data?.total ?? 0);
            })
            .catch((err) => {
                if (!active) return;
                if (err.status === 401) {
                    navigate("/login", { replace: true });
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

    async function handleRemove(cartItemId) {
        setError("");
        setRemovingId(cartItemId);
        try {
            await apiPost("/cart/remove", { cartItemId });
            await loadCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setRemovingId(null);
        }
    }

    return (
        <div className="container">
            <div className="page-header">
                <h2>Your Shopping Cart</h2>
                <div className="page-actions">
                    <Link className="btn btn-outline" to="/products">
                        ← Continue Shopping
                    </Link>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading your cart...</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <strong>{item.productName}</strong>
                                        </td>
                                        <td>₹{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.subtotal}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                disabled={removingId === item.id}
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                {removingId === item.id ? "Removing..." : "Remove"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="cart-summary">
                        <span className="cart-summary-label">Order Total</span>
                        <span className="price">₹{total}</span>
                    </div>
                </>
            )}
        </div>
    );
}
