import { useState, useEffect } from "react";
import API from "../Services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, author: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/reviews/${id}/approve`);
      setReviews(
        reviews.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
      );
    } catch (err) {
      console.error("Error approving review:", err);
    }
  };

  const confirmDelete = (id, author) => {
    setDeleteConfirm({ show: true, id, author });
  };

  const handleDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null, author: "" });
    try {
      await API.delete(`/admin/reviews/${id}`);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const filtered = filter === "All" 
    ? reviews 
    : reviews.filter(r => r.status === filter);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <>
        <div className="page-header">
          <h1>Reviews</h1>
          <p>Monitor and moderate customer reviews and product feedback.</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading reviews...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Reviews</h1>
        <p>Monitor and moderate customer reviews and product feedback.</p>
      </div>

      {/* Review summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "28px" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "var(--accent-light)", lineHeight: 1 }}>{averageRating}</h2>
          <div style={{ color: "#f59e0b", fontSize: "1.4rem", margin: "10px 0" }}>★★★★★</div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Average rating from {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.82rem", width: "40px", color: "var(--text-secondary)" }}>{stars} Star</span>
                <div style={{ flex: 1, height: "8px", background: "var(--bg-primary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${percentage}%`, height: "100%", background: "#f59e0b" }} />
                </div>
                <span style={{ fontSize: "0.82rem", width: "24px", textAlign: "right", color: "var(--text-muted)" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moderation Controls */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["All", "Approved", "Pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-ghost"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "var(--text-muted)" }}>No reviews found.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 600 }}>{r.author}</span>
                    <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>{r.product}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.date}</span>
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: "0.9rem", marginTop: "4px" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className={`badge ${r.status === "Approved" ? "badge-success" : "badge-warning"}`}>
                    {r.status}
                  </span>
                  {r.status === "Pending" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApprove(r.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmDelete(r.id, r.author)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {r.title && (
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                  {r.title}
                </p>
              )}

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                "{r.comment}"
              </p>
            </div>
          ))
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.25s ease",
        }} onClick={() => setDeleteConfirm({ show: false, id: null, author: "" })}>
          <div style={{
            background: "var(--bg-secondary, #1e1e2d)",
            borderRadius: "20px",
            padding: "40px 36px 32px",
            maxWidth: "420px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
            animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ background: "rgba(244,63,94,0.1)", borderRadius: "50%", padding: "12px", width: "72px", height: "72px" }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary, #fff)", margin: "0 0 8px" }}>Delete Review</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary, #a0a0b0)", lineHeight: 1.6, margin: "0 0 6px" }}>
              Are you sure you want to delete the review by
            </p>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary, #fff)", margin: "0 0 24px" }}>
              "{deleteConfirm.author}"?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null, author: "" })}
                style={{
                  fontSize: "0.875rem", fontWeight: 600,
                  padding: "11px 28px", borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "var(--bg-primary, #151521)",
                  color: "var(--text-secondary, #a0a0b0)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.target.style.background = "var(--bg-primary, #151521)"; e.target.style.transform = "translateY(0)"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  fontSize: "0.875rem", fontWeight: 600,
                  padding: "11px 28px", borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                  color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(244,63,94,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.boxShadow = "0 6px 20px rgba(244,63,94,0.5)"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.target.style.boxShadow = "0 4px 14px rgba(244,63,94,0.35)"; e.target.style.transform = "translateY(0)"; }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

export default Reviews;
