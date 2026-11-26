import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import StockBadge from "../components/StockBadge";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [addedMessage, setAddedMessage] = useState("");

    useEffect(() => {
        let active = true;
        apiGet(`/products?id=${encodeURIComponent(id)}`)
            .then((data) => {
                if (!active) return;
                setError("");
                setProduct(data);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [id]);

    async function handleAddToCart(e) {
        e.preventDefault();
        if (!authenticated) {
            navigate("/login");
            return;
        }
        setError("");
        setAddedMessage("");
        setSubmitting(true);
        try {
            await apiPost("/cart/add", {
                productId: product.id,
                quantity: Number(quantity),
            });
            setAddedMessage("Added to cart.");
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
                return;
            }
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container">
            <Link className="back-link" to="/products">
                ← Back to Products
            </Link>

            {loading ? (
                <div className="loading-state">Loading product...</div>
            ) : !product ? (
                <div className="alert-error">{error || "Product not found."}</div>
            ) : (
                <div className={`product-detail-layout${product.imageUrl ? "" : " no-image"}`}>
                    {product.imageUrl && (
                        <div className="detail-media">
                            <img className="detail-img" src={product.imageUrl} alt={product.name} />
                        </div>
                    )}

                    <div>
                        <div className="detail-info-card">
                            <h2>{product.name}</h2>
                            <StockBadge stock={product.stock} showZeroCount />
                            <p className="detail-description">
                                {product.description || "No description provided."}
                            </p>
                            <div className="detail-price-row">
                                <span className="price">₹{product.price}</span>
                            </div>
                        </div>

                        <div className="form-card">
                            {error && <div className="alert-error">{error}</div>}
                            {addedMessage && (
                                <div className="alert-success">
                                    {addedMessage} <Link to="/cart">View Cart</Link>
                                </div>
                            )}

                            <form onSubmit={handleAddToCart}>
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={product.stock > 0 ? product.stock : 1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    disabled={product.stock <= 0}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn btn-full"
                                    disabled={submitting || product.stock <= 0}
                                >
                                    {product.stock <= 0
                                        ? "Out of Stock"
                                        : submitting
                                          ? "Adding..."
                                          : "Add to Cart"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
