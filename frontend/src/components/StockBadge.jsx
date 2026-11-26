export default function StockBadge({ stock, showZeroCount = false }) {
    if (stock > 5) {
        return <span className="badge badge-in-stock">In Stock ({stock})</span>;
    }
    if (stock > 0) {
        return <span className="badge badge-low-stock">Only {stock} left</span>;
    }
    return (
        <span className="badge badge-out-of-stock">
            {showZeroCount ? `Out of Stock (${stock})` : "Out of Stock"}
        </span>
    );
}
