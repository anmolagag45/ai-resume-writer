const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.generateResume = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Please send POST request" });
      }

      const { name, email, phone, skills, experience, education, jobRole, style } = req.body;

      if (!name || !skills) {
        return res.status(400).send({ error: "Missing name or skills" });
      }

      const systemMessage =
        "You are an expert resume writer. Produce an ATS-friendly, professional resume.";

      const userPrompt = `
      Name: ${name}
      Email: ${email || ""}
      Phone: ${phone || ""}
      Skills: ${skills}
      Experience: ${experience || ""}
      Education: ${education || ""}
      Job Role: ${jobRole || ""}
      Style: ${style || "Professional"}

      Write a polished resume in plain text. Use headings like SUMMARY, SKILLS, EXPERIENCE, EDUCATION. Keep it concise.
      `;

      // Call OpenAI
      const openaiKey = functions.config().openai.key;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
        }
      );

      const resumeText = response.data.choices[0].message.content;

      // Save in Firestore
      const docRef = await db.collection("resumes").add({
        name,
        email,
        phone,
        jobRole,
        skills,
        experience,
        education,
        style,
        resumeText,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({ id: docRef.id, resumeText });
    } catch (err) {
      console.error("Function error:", err);
      const errorMessage = err.response ? err.response.data : err.message;
      return res.status(500).send({ error: "Server error", details: errorMessage });
    }
  });
});
