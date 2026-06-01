import { useState } from "react";

const initialReviews = [
  { id: 1, author: "Arjun Mehta", rating: 5, comment: "Absolutely love the fit and style. The fabric quality is top-notch!", product: "Black Hoodie", date: "01 Jun 2026", status: "Approved" },
  { id: 2, author: "Priya Sharma", rating: 4, comment: "Very comfortable running shoes, but the color was slightly darker than pictured.", product: "Running Shoes", date: "31 May 2026", status: "Approved" },
  { id: 3, author: "Rahul Singh", rating: 2, comment: "The stitching started coming off after the first wash. Disappointed.", product: "Slim Fit Jeans", date: "30 May 2026", status: "Pending" },
  { id: 4, author: "Neha Kapoor", rating: 5, comment: "Super cute and matches the sizing chart perfectly. Received many compliments!", product: "Floral Dress", date: "28 May 2026", status: "Approved" },
  { id: 5, author: "Amit Verma", rating: 1, comment: "Wrong size delivered, and support has been slow to reply.", product: "Sports T-shirt", date: "25 May 2026", status: "Pending" },
];

function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("All");

  const handleApprove = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const filtered = filter === "All" 
    ? reviews 
    : reviews.filter(r => r.status === filter);

  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

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
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Average rating from {reviews.length} reviews</p>
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
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                "{r.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Reviews;
