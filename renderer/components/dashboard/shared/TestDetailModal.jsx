import { X, FileText, Upload, Download, ChevronDown } from "lucide-react";
import { useState } from "react";

const TestDetailModal = ({ test, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const toggle = (cat) => setExpandedCategories((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]);

  if (!test) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", borderRadius: 20, background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", border: "1px solid #f0ede6" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f0ede6", background: "linear-gradient(90deg,#fffdf0,#fff)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fffbeb", border: "1.5px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} color="#b45309" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#111", margin: 0 }}>Report Details</h2>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>{test.workName || "N/A"}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9ca3af"; }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <SL>Contractor Info</SL>
              <D label="PAN Number"          value={test.panNumber} />
              <D label="Aadhaar Number"      value={test.aadhaarNumber} />
              <D label="Registration Number" value={test.registrationNumber} />
              <D label="Taluka"              value={test.taluka} />
              <D label="Contractor Name"     value={test.contractorName} />
              <div style={{ borderRadius: 12, padding: "14px 16px", background: "#fffbeb", border: "1.5px solid #fde68a", marginTop: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".16em", color: "#b45309", marginBottom: 4 }}>Total Amount</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#111", fontFamily: "'Georgia',serif" }}>₹{(test.totalAmount || 0).toLocaleString("en-IN")}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <SL>Documents</SL>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                  {test.documents?.length > 0 ? test.documents.map((doc, i) => (
                    <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)", color: "#f5c100", textDecoration: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                      <FileText size={15} />{doc.name}
                    </a>
                  )) : <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No documents available</p>}
                </div>
              </div>
              <div>
                <SL>Material & Test</SL>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {test.materials?.length > 0 ? test.materials.map((mat, i) => {
                    const open = expandedCategories.includes(mat.category);
                    return (
                      <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #f0ede6" }}>
                        <button onClick={() => toggle(mat.category)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#fafaf8", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>
                          <span>{mat.category}</span>
                          <ChevronDown size={15} color="#9ca3af" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                        </button>
                        {open && (
                          <div style={{ padding: "10px 14px", background: "#fff" }}>
                            {mat.tests?.map((t, j) => (
                              <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#4b5563", padding: "3px 0" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5c100", flexShrink: 0 }} />{t}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }) : <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No material data</p>}
                </div>
              </div>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 800, background: "linear-gradient(135deg,#f5c100,#e6a800)", color: "#1a0f00", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(245,193,0,0.35)" }}>
                <Upload size={15} /> Upload Report
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: "1px solid #f0ede6", background: "#fafaf8" }}>
           <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800, background: "#f5c100", color: "black", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
            <Download size={14} /> Download Report
          </button>

          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 12, fontWeight: 700,background: "#f5c100", color: "black", cursor: "pointer" }}>Submit</button>
         
        </div>
      </div>
    </div>
  );
};

const SL = ({ children }) => <p style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".18em", color: "#9ca3af", margin: "0 0 10px" }}>{children}</p>;
const D  = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em", color: "#9ca3af", marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{value || "N/A"}</div>
  </div>
);

export default TestDetailModal;