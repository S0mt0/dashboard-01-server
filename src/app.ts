import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import bcrypt from "bcrypt";

import { ErrorHandler } from "./api/middlewares/error-handler";
import router from "./api/router/router";
import { connect } from "mongoose";

const app = express();

app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json data
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use("/api/v1", router());

// custom middlewares
app.use(ErrorHandler);

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(`Server is listening on port: ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// app.listen(process.env.PORT, () =>
//   console.log(`Server is listening on port: ${process.env.PORT}`)
// );
