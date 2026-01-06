const express = require("express");

const app = express();
app.use(express.json());
app.use(express.static(".")); // serves index.html from same folder

// ===== YOUR DEMO CREDS (as you provided) =====
const CLIENT_ID = "Webline";
const CLIENT_SECRET = "z33v3SyvCE6c";
const USERNAME = "test_my_check";
const PASSWORD = "21021964Dan";

// ===== MINIMAX URLS (match docs / lowercase) =====
const TOKEN_URL = "https://moj.minimax.si/si/aut/oauth20/token";
const API_BASE = "https://moj.minimax.si/si/api";

let accessToken = null;

// 1) Get token (OAuth2 password grant)
app.post("/token", async (req, res) => {
  try {
    const body = new URLSearchParams({
      grant_type: "password",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: USERNAME,
      password: PASSWORD,
      scope: "api",
    });

    const r = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) return res.status(r.status).json(data);

    accessToken = data.access_token;
    return res.json({
      ok: true,
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token: data.access_token,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

// 2) Proxy any API call using the token
app.post("/minimax", async (req, res) => {
  try {
    if (!accessToken) return res.status(401).json({ error: "No token. Click 'Get token' first." });

    const { path, method, body } = req.body || {};
    if (!path?.startsWith("/")) return res.status(400).json({ error: "path must start with / (example: /currentuser/profile)" });

    const m = (method || "GET").toUpperCase();
    const url = API_BASE + path;

    const r = await fetch(url, {
      method: m,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: ["GET", "HEAD"].includes(m) ? undefined : JSON.stringify(body ?? {}),
    });

    const text = await r.text();
    try {
      return res.status(r.status).json(JSON.parse(text));
    } catch {
      return res.status(r.status).send(text);
    }
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

app.listen(5173, () => {
  console.log("Open: http://localhost:5173");
});
