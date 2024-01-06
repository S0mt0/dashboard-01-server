import { CorsOptions } from "cors";

const prodOrigin = [
  "https://afrolay.vercel.app",
  "https://www.afrolay.vercel.app",
  "https://www.parcelo.vercel.app",
  "https://www.dhlshipping.vercel.app",
  "https://dhlshipping.vercel.app",
  "https://parcelo.vercel.app",
  "https://afrolay.netlify.app",
  "https://www.afrolay.netlify.app",
  "https://www.dhlimited.onrender.com",
  "https://dhlimited.onrender.com",
  "http://localhost:3000",
];

const devOrigin = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://dhlimited.vercel.app",
  "https://www.dhlimited.vercel.app",
  "https://dhlimited.onrender.com",
  "https://www.dhlimited.onrender.com",
  "[::1]:3001",
  "[::1]:3000",
];

const allowedOrigins =
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
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
