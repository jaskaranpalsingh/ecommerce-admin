import { useState } from "react";
import API from "../Services/api";

function AddProduct() {
  const [form, setForm] = useState({
    title: "", price: "", category: "", stock: "", description: "", image: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"
      };
      await API.post("/products", payload);
      setSuccess(true);
      setForm({ title: "", price: "", category: "", stock: "", description: "", image: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Add Product</h1>
        <p>Fill in the details below to create a new product listing.</p>
      </div>

      <div style={{ maxWidth: "720px" }}>
        <div className="form-card">

          {success && (
            <div style={{
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: "24px",
              color: "var(--success)", fontSize: "0.875rem", display: "flex", gap: "10px"
            }}>
              ✅ Product added successfully!
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: "24px",
              color: "var(--danger)", fontSize: "0.875rem", display: "flex", gap: "10px"
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Title / Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Alternative Culture graphic T-shirt"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 49.99"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category...</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Jackets">Jackets</option>
                  <option value="T-shirts">T-shirts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="e.g. 100"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                placeholder="e.g. https://images.unsplash.com/..."
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Write a short product description..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "➕ Add Product"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setForm({ title: "", price: "", category: "", stock: "", description: "", image: "" })}
              >
                🔄 Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;