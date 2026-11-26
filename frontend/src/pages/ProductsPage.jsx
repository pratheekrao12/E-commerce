import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api";
import StockBadge from "../components/StockBadge";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        apiGet("/products")
            .then((data) => {
                if (active) setProducts(Array.isArray(data) ? data : []);
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
    }, []);

    return (
        <div className="container">
            <div className="page-header">
                <h2>Products</h2>
            </div>

            {error && <div className="alert-error">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <p>No products available yet.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map((p) => (
                        <div className="card" key={p.id}>
                            <div className="card-media">
                                {p.imageUrl ? (
                                    <img className="card-img" src={p.imageUrl} alt={p.name} />
                                ) : (
                                    <div className="card-media-placeholder">No Image</div>
                                )}
                            </div>
                            <div className="card-body">
                                <div>
                                    <h3>{p.name}</h3>
                                    <div className="card-meta">
                                        <span className="price">₹{p.price}</span>
                                        <StockBadge stock={p.stock} showZeroCount />
                                    </div>
                                </div>
                                <Link className="btn btn-full" to={`/products/${p.id}`}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
