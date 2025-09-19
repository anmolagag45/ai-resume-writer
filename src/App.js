import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaMoon, FaSun } from "react-icons/fa";
import "./App.css";

// 🌍 Translations (form + resume)
const translations = {
  en: { name: "Name", email: "Email", phone: "Phone", jobRole: "Job Role", skills: "Skills", experience: "Experience", education: "Education", summary: "Summary", contact: "Contact", upload: "Upload Profile Picture", template: "Template", download: "Download Resume" },
  hi: { name: "नाम", email: "ईमेल", phone: "फ़ोन", jobRole: "नौकरी की भूमिका", skills: "कौशल", experience: "अनुभव", education: "शिक्षा", summary: "सारांश", contact: "संपर्क", upload: "प्रोफ़ाइल चित्र अपलोड करें", template: "टेम्पलेट", download: "रिज़्यूमे डाउनलोड करें" },
  es: { name: "Nombre", email: "Correo", phone: "Teléfono", jobRole: "Puesto", skills: "Habilidades", experience: "Experiencia", education: "Educación", summary: "Resumen", contact: "Contacto", upload: "Subir Foto", template: "Plantilla", download: "Descargar CV" },
  fr: { name: "Nom", email: "Email", phone: "Téléphone", jobRole: "Poste", skills: "Compétences", experience: "Expérience", education: "Éducation", summary: "Résumé", contact: "Contact", upload: "Télécharger Photo", template: "Modèle", download: "Télécharger CV" },
  de: { name: "Name", email: "E-Mail", phone: "Telefon", jobRole: "Beruf", skills: "Fähigkeiten", experience: "Erfahrung", education: "Ausbildung", summary: "Zusammenfassung", contact: "Kontakt", upload: "Profilbild Hochladen", template: "Vorlage", download: "Lebenslauf Herunterladen" },
  zh: { name: "姓名", email: "邮箱", phone: "电话", jobRole: "职位", skills: "技能", experience: "经验", education: "教育", summary: "总结", contact: "联系方式", upload: "上传头像", template: "模板", download: "下载简历" },
  ar: { name: "الاسم", email: "البريد الإلكتروني", phone: "الهاتف", jobRole: "الوظيفة", skills: "المهارات", experience: "الخبرة", education: "التعليم", summary: "الملخص", contact: "التواصل", upload: "رفع الصورة", template: "قالب", download: "تحميل السيرة الذاتية" },
  ru: { name: "Имя", email: "Эл. почта", phone: "Телефон", jobRole: "Должность", skills: "Навыки", experience: "Опыт", education: "Образование", summary: "Резюме", contact: "Контакты", upload: "Загрузить Фото", template: "Шаблон", download: "Скачать Резюме" },
  pt: { name: "Nome", email: "Email", phone: "Telefone", jobRole: "Cargo", skills: "Habilidades", experience: "Experiência", education: "Educação", summary: "Resumo", contact: "Contato", upload: "Carregar Foto", template: "Modelo", download: "Baixar Currículo" },
  ja: { name: "名前", email: "メール", phone: "電話", jobRole: "職務", skills: "スキル", experience: "経験", education: "学歴", summary: "概要", contact: "連絡先", upload: "写真をアップロード", template: "テンプレート", download: "履歴書をダウンロード" },
};

function App() {
  const [form, setForm] = useState({
    name: "Aryan Example",
    email: "aryan@example.com",
    phone: "+91 98765 43210",
    jobRole: "Computer Science Student",
    skills: "JavaScript, React, Node.js, Firebase",
    experience: "Intern - Built an AI Resume Generator",
    education: "B.Tech Computer Science, 2025",
    summary: "Motivated fresher passionate about technology and problem-solving.",
  });
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);
  const [template, setTemplate] = useState("professional");
  const [profilePic, setProfilePic] = useState(null);

  const previewRef = useRef();
  const t = translations[language] || translations["en"];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function downloadPDF() {
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${form.name.replace(/\s+/g, "_")}_resume.pdf`);
  }

  // 🎨 Resume template
  const renderTemplate = () => {
    if (template === "professional") {
      return (
        <div ref={previewRef} style={{ display: "flex", width: "700px", background: darkMode ? "#0f172a" : "white", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)", overflow: "hidden", color: darkMode ? "#f8fafc" : "#111" }}>
          {/* Sidebar */}
          <div style={{ width: "220px", background: "#4f46e5", color: "white", padding: "20px" }}>
            {profilePic && <img src={profilePic} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "auto", marginBottom: "15px" }} />}
            <h2 style={{ textAlign: "center" }}>{form.name}</h2>
            <p style={{ textAlign: "center" }}>{form.jobRole}</p>
            <div style={{ marginTop: "20px" }}>
              <h3>{t.contact}</h3>
              <p>{form.email}</p>
              <p>{form.phone}</p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <h3>{t.skills}</h3>
              <ul style={{ padding: 0, listStyle: "none" }}>
                {form.skills.split(",").map((skill, i) => (
                  <li key={i}>{skill.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Main */}
          <div style={{ flex: 1, padding: "25px" }}>
            <h1>{form.name}</h1>
            <h2 style={{ color: "#818cf8" }}>{form.jobRole}</h2>
            <h3>{t.summary}</h3>
            <p>{form.summary}</p>
            <h3>{t.experience}</h3>
            <p>{form.experience}</p>
            <h3>{t.education}</h3>
            <p>{form.education}</p>
          </div>
        </div>
      );
    }
    if (template === "creative") {
      return (
        <div ref={previewRef} style={{ width: "700px", padding: "20px", borderRadius: "12px", background: "linear-gradient(135deg,#9333ea,#4f46e5)", color: "white" }}>
          <h1>{form.name}</h1>
          <h2>{form.jobRole}</h2>
          {profilePic && <img src={profilePic} alt="Profile" style={{ width: "120px", borderRadius: "50%", margin: "10px 0" }} />}
          <p><b>{t.summary}:</b> {form.summary}</p>
          <p><b>{t.skills}:</b> {form.skills}</p>
          <p><b>{t.experience}:</b> {form.experience}</p>
          <p><b>{t.education}:</b> {form.education}</p>
          <p><b>{t.contact}:</b> {form.email}, {form.phone}</p>
        </div>
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: darkMode ? "#0f172a" : "#f8fafc", color: darkMode ? "#f8fafc" : "#111", fontFamily: "Poppins, sans-serif" }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: darkMode ? "#1e293b" : "#e2e8f0" }}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "6px", borderRadius: "6px" }}>
          {Object.keys(translations).map((lang) => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
        </select>
        <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", cursor: "pointer", color: darkMode ? "white" : "black", fontSize: "20px" }}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* MAIN BODY */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* FORM PANEL */}
        <div style={{ flex: 1, padding: "30px", borderRight: "2px solid #475569" }}>
          <h2 style={{ marginBottom: "20px", color: "#818cf8" }}>Build Resume</h2>
          <label>{t.name}</label>
          <input name="name" value={form.name} onChange={handleChange} style={inputStyle(darkMode)} />
          <label>{t.email}</label>
          <input name="email" value={form.email} onChange={handleChange} style={inputStyle(darkMode)} />
          <label>{t.phone}</label>
          <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle(darkMode)} />
          <label>{t.jobRole}</label>
          <input name="jobRole" value={form.jobRole} onChange={handleChange} style={inputStyle(darkMode)} />
          <label>{t.skills}</label>
          <textarea name="skills" value={form.skills} onChange={handleChange} style={inputAreaStyle(darkMode)} />
          <label>{t.experience}</label>
          <textarea name="experience" value={form.experience} onChange={handleChange} style={inputAreaStyle(darkMode)} />
          <label>{t.education}</label>
          <input name="education" value={form.education} onChange={handleChange} style={inputStyle(darkMode)} />
          <label>{t.summary}</label>
          <textarea name="summary" value={form.summary} onChange={handleChange} style={inputAreaStyle(darkMode)} />
          <label>{t.upload}</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ margin: "10px 0" }} />
          <label>{t.template}</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} style={inputStyle(darkMode)}>
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        {/* RESUME PREVIEW PANEL */}
        <div style={{ flex: 2, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {renderTemplate()}
          <button onClick={downloadPDF} style={{ marginTop: "25px", padding: "12px 24px", background: "linear-gradient(135deg, #4f46e5, #9333ea)", color: "white", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            {t.download}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = (darkMode) => ({
  margin: "8px 0",
  padding: "10px",
  width: "100%",
  border: "1px solid #475569",
  borderRadius: "6px",
  background: darkMode ? "#1e293b" : "white",
  color: darkMode ? "white" : "black",
});

const inputAreaStyle = (darkMode) => ({
  ...inputStyle(darkMode),
  height: "60px",
});

export default App;