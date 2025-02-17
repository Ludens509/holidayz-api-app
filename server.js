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
app.use(cors({ origin: '*' }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from the "dist" directory
//   app.use(express.static(path.join(__dirname, '../holidayz-world/dist')));

//   // Serve assets from the "dist/assets" directory
//   app.use('/assets', express.static(path.join(__dirname, '../holidayz-world/dist/assets')));

//   // Handle SPA routing (e.g., React Router)
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../', 'holidayz-world', 'dist', 'index.html'));
//   });
// } else {
//   app.get('/', (req, res) => res.send('Please set to production'));
// }

app.get("/api/holidays", async (req, res) => {
  const { country, year, month, day } = req.query;
  console.log(apikey);
  let apiUrl = `https://holidayapi.com/v1/holidays?key=${apikey}&country=${country}&year=${year}`;

  if (month !== undefined && month !== null) {
    apiUrl += `&month=${month}`;
  }
  if (day !== undefined && day !== null) {
    apiUrl += `&day=${day}`;
  }
  console.log("From server:", apiUrl);
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.holidays && data.holidays.length > 0) {
      res.json(data);
    } else {
      res.json({ message: "No holidays found for the given criteria.", holidays: [] });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch holidays", details: error.message });
  }

  // try {
  //   const response = await fetch(apiUrl);

  //   if (!response.ok) {
  //     const errorText = await response.text();
  //     console.log("Raw API Response:", errorText);
  //     throw new Error(`API returned ${response.status}: ${errorText}`);
  //   }

  //   const data = await response.json();
  //   res.json(data);
  // } catch (error) {
  //   console.error("Error fetching or parsing data:", error);
  //   res.status(500).json({ error: "Failed to fetch data", details: error.message });
  // }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../holidayz-world/dist')));
  app.use('/assets', express.static(path.join(__dirname, '../holidayz-world/dist/assets')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../holidayz-world/dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
