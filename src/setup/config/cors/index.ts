import { CorsOptions } from "cors";

const prodOrigin = [""];

const devOrigin = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://dhlimited.vercel.app",
  "https://www.dhlimited.vercel.app",
  "https://dhlimited.onrender.com",
  "https://www.dhlimited.onrender.com",
  "https://toshtracker.onrender.com",
  "https://www.toshtracker.onrender.com",
  "[::1]:3001",
  "[::1]:3000",
];

const allowedOrigin =
  process.env.NODE_ENV === "production" ? prodOrigin : devOrigin;

/**
 * Cors options
 */
export const corsOptions: CorsOptions = {
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],

  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  origin: (origin, callback) => {
    if (devOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS..."));
    }
  },
};
