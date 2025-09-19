import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

const FUNCTION_URL = "http://localhost:5000/generate-resume"; 
// replace with your real URL

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    jobRole: "",
    style: "Professional",
  });
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function generateResume(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResumeText("");

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        const err = await resp.json();
        setError(JSON.stringify(err));
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setResumeText(data.resumeText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadPDF() {
    if (!resumeText) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(resumeText, 180);
    let y = 10;
    for (let line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 7;
    }
    doc.save(`${form.name || "resume"}-resume.pdf`);
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Resume Writer</h1>
      <form onSubmit={generateResume}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <br />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <br />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <br />
        <textarea name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} required />
        <br />
        <textarea name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} />
        <br />
        <textarea name="education" placeholder="Education" value={form.education} onChange={handleChange} />
        <br />
        <input name="jobRole" placeholder="Target Job Role" value={form.jobRole} onChange={handleChange} />
        <br />
        <select name="style" value={form.style} onChange={handleChange}>
          <option>Professional</option>
          <option>Modern</option>
          <option>Creative</option>
        </select>
        <br />
        <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Resume"}</button>
      </form>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {resumeText && (
        <div style={{ marginTop: 20 }}>
          <h2>Generated Resume</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 10 }}>
            {resumeText}
          </pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;