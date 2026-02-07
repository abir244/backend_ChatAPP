import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// ✅ Basic parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS
// For mobile apps, `Origin` is usually null (works).
// For web apps, set CORS_ORIGINS in Railway Variables.
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (Flutter mobile, curl, Postman)
        if (!origin) return callback(null, true);

        const allowed = process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
            : [
                "http://localhost:5173",
                "http://localhost:3000",
            ];

        if (allowed.includes(origin)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ✅ Railway health endpoints (must return quickly)
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) =>
    res.status(200).json({ ok: true, message: "Server healthy" })
);

// ✅ Routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message || "Internal Server Error" });
});

export default app;