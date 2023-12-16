import "express-async-errors";

import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connect } from "mongoose";
import compression from "compression";
import formData from "express-form-data";

// Imports - custom modules
import cloudinaryConfig from "./setup/config/cloudinary";
import { ErrorHandler } from "./setup/middlewares/error-handler";
import router from "./setup/router/router";
import { corsOptions } from "./setup/config";

config();
cloudinaryConfig();
const app = express();

app.use(cors(corsOptions));
app.use(formData.parse());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

// Load app routes and handlers
app.use("/api/v1", router());

// Custom error handler
app.use(ErrorHandler);

/**
 * Start Server only after successful connection to database
 */
const startServer = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(`Server is listening on port: ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();

// app.listen(process.env.PORT, () =>
//   console.log(`Server is listening on port: ${process.env.PORT}`)
// );
