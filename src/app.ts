import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import bcrypt from "bcrypt";
import { ErrorHandler } from "./api/middlewares/error-handler";

const app = express();

app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json data
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// custom middlewares
app.use(ErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port: ${process.env.PORT}`)
);
