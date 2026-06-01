import { useEffect, useState } from "react";
import API from "../Services/api";

function Products() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");

  // ─── Edit modal state ─────────────────────────────────────────────────────
  const [editProduct, setEditProduct] = useState(null); // null = closed
  const [editForm, setEditForm]       = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError]     = useState("");

  // ─── Delete confirm state ─────────────────────────────────────────────────
  const [deleteId, setDeleteId]       = useState(null); // null = closed
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Fetch products ───────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ─── Search filter ────────────────────────────────────────────────────────
  const filtered = products.filter((p) =>
    (p.title || p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ─── Edit handlers ────────────────────────────────────────────────────────
  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      title:       product.title || product.name || "",
      price:       product.price ?? "",
      category:    product.category || "",
      description: product.description || "",
      image:       product.image || "",
    });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      await API.put(`/products/${editProduct._id}`, {
        title:       editForm.title,
        price:       Number(editForm.price),
        category:    editForm.category,
        description: editForm.description,
        image:       editForm.image,
      });
      setEditProduct(null);
      fetchProducts();               // refresh list
    } catch (err) {
      console.error(err);
      setEditError("Failed to save changes. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Delete handlers ──────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/products/${deleteId}`);
      setDeleteId(null);
      fetchProducts();               // refresh list
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Loading / error states ───────────────────────────────────────────────
  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Loading products...</span>
    </div>
  );

  if (error) return (
    <div className="empty-state">
      <div className="empty-icon">⚠️</div>
      <p style={{ color: "var(--danger)" }}>{error}</p>
    </div>
  );

  return (
    <>
      {/* ─── Page header ──────────────────────────────────────────────────── */}
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your entire product catalog in one place.</p>
      </div>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <div className="table-container">
        <div className="table-header">
          <h2>All Products ({filtered.length})</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <a href="/add-product" className="btn btn-primary btn-sm">
              ➕ Add Product
            </a>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, index) => (
                <tr key={product._id || index}>
                  <td style={{ color: "var(--text-muted)" }}>{index + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title || product.name}
                          style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border)" }}
                        />
                      ) : (
                        <div className="product-img">🧥</div>
                      )}
                      <div>
                        <p style={{ fontWeight: 600 }}>{product.title || product.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          ID: {product._id?.slice(-6) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--accent-light)" }}>
                    ${product.price}
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {product.category || "General"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {product.stock ?? "—"}
                  </td>
                  <td>
                    <span className={`badge ${product.stock === 0 ? "badge-danger" : "badge-success"}`}>
                      {product.stock === 0 ? "Out of Stock" : "In Stock"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(product._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── Edit Modal ───────────────────────────────────────────────────── */}
      {editProduct && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--bg-secondary)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
            width: "100%", maxWidth: "540px", padding: "32px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                ✏️ Edit Product
              </h2>
              <button
                onClick={() => setEditProduct(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>

            {editError && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "var(--radius-sm)", padding: "12px 16px", marginBottom: "20px",
                color: "var(--danger)", fontSize: "0.875rem"
              }}>
                ⚠️ {editError}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label>Product Title</label>
              <input type="text" name="title" value={editForm.title} onChange={handleEditChange} placeholder="Product name" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={editForm.category} onChange={handleEditChange}>
                  <option value="">Select category...</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Jackets">Jackets</option>
                  <option value="T-shirts">T-shirts</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label>Image URL</label>
              <input type="url" name="image" value={editForm.image} onChange={handleEditChange} placeholder="https://..." />
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label>Description</label>
              <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={3} style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setEditProduct(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditSave}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────────────────── */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--bg-secondary)", borderRadius: "var(--radius)",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
            width: "100%", maxWidth: "400px", padding: "32px", textAlign: "center"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🗑️</div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)" }}>
              Delete Product?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "28px" }}>
              This action cannot be undone. The product will be permanently removed from the database.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "🗑️ Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
