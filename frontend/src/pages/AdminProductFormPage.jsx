import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";

export default function AdminProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        let active = true;
        apiGet(`/admin/products/form?id=${encodeURIComponent(id)}`)
            .then((data) => {
                if (!active || !data) return;
                setError("");
                setName(data.name ?? "");
                setDescription(data.description ?? "");
                setPrice(data.price ?? "");
                setStock(data.stock ?? "");
                setImageUrl(data.imageUrl ?? "");
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
    }, [id, isEdit]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await apiPost("/admin/products/save", {
                id: isEdit ? Number(id) : null,
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
            });
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container">
            <div className="form-card">
                <h2>{isEdit ? "Edit Product" : "Add New Product"}</h2>

                {error && <div className="alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-state">Loading product...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="product-name">Name</label>
                        <input
                            id="product-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="product-description">Description</label>
                        <textarea
                            id="product-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label htmlFor="product-price">Price</label>
                        <input
                            id="product-price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />

                        <label htmlFor="product-stock">Stock</label>
                        <input
                            id="product-stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />

                        <label htmlFor="product-image">Image URL (optional)</label>
                        <input
                            id="product-image"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />

                        <div className="form-actions">
                            <button type="submit" className="btn" disabled={submitting}>
                                {submitting ? "Saving..." : "Save Product"}
                            </button>
                            <Link className="btn btn-outline" to="/admin/dashboard">
                                Cancel
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
