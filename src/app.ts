import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connect } from "mongoose";
import compression from "compression";
import formData from "express-form-data";

import cloudinaryConfig from "./api/config/cloudinary";
import { ErrorHandler } from "./api/middlewares/error-handler";
import router from "./api/router/router";

const app = express();

cloudinaryConfig();

app.use(cors());
app.use(formData.parse());
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use("/api/v1", router());

// custom middlewares
app.use(ErrorHandler);

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
