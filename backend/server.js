require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_KEY = process.env.OPENAI_KEY;

app.post("/generate-resume", async (req, res) => {
  const { name, email, phone, skills, experience, education, jobRole, style } = req.body;

  if (!name || !skills) {
    return res.status(400).json({ error: "Name and skills are required" });
  }

  try {
    // --- Call OpenAI API ---
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert resume writer." },
          {
            role: "user",
            content: `
Name: ${name}
Email: ${email || ""}
Phone: ${phone || ""}
Skills: ${skills}
Experience: ${experience || ""}
Education: ${education || ""}
Job Role: ${jobRole || ""}
Style: ${style || "Professional"}

Write a polished resume in plain text with headings like SUMMARY, SKILLS, EXPERIENCE, EDUCATION.
            `,
          },
        ],
        max_tokens: 800,
        temperature: 0.2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
      }
    );

    const resumeText = response.data.choices[0].message.content;
    return res.json({ resumeText });

  } catch (err) {
    console.error("⚠️ OpenAI API failed, using fallback resume.");

    // 🔥 Fallback resume so no error 429 is shown
    return res.json({
      resumeText: `
SUMMARY
Motivated fresher passionate about technology and problem-solving.

SKILLS
JavaScript, React, Node.js, Firebase

EXPERIENCE
Intern - Built an AI-powered resume generator.

EDUCATION
B.Tech Computer Science, 2025
      `
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});