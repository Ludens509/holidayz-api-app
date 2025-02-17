import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const apikey = process.env.NODE_API_KEY;
app.use(cors());

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the "dist" directory
  app.use(express.static(path.join(__dirname, '../holidayz-world/dist')));

  // Serve assets from the "dist/assets" directory
  app.use('/assets', express.static(path.join(__dirname, '../holidayz-world/dist/assets')));

  // Handle SPA routing (e.g., React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'holidayz-world', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.get("/api/holidays", async (req, res) => {
  const { country, year, month, day } = req.query;
  let apiUrl = `https://holidayapi.com/v1/holidays?key=${apikey}&country=${country}&year=${year}`;

  if (month) apiUrl += `&month=${month}`;
  if (day) apiUrl += `&day=${day}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Raw API Response:", errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
