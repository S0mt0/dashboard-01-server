"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = require("mongoose");
const compression_1 = __importDefault(require("compression"));
const express_form_data_1 = __importDefault(require("express-form-data"));
// Imports - custom modules
const cloudinary_1 = __importDefault(require("./setup/config/cloudinary"));
const error_handler_1 = require("./setup/middlewares/error-handler");
const router_1 = __importDefault(require("./setup/router/router"));
const config_1 = require("./setup/config");
(0, dotenv_1.config)();
(0, cloudinary_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.corsOptions));
app.use(express_form_data_1.default.parse());
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.json({ limit: "5mb" }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
// Load app routes and handlers
app.use("/api/v1", (0, router_1.default)());
// Custom error handler
app.use(error_handler_1.ErrorHandler);
/**
 * Start Server only after successful connection to database
 */
const startServer = async () => {
    try {
        await (0, mongoose_1.connect)(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => console.log(`Server is listening on port: ${process.env.PORT}`));
    }
    catch (error) {
        console.log("An error occured while trying to connect to the database, please try again.");
    }
};
startServer();
// app.listen(process.env.PORT, () =>
//   console.log(`Server is listening on port: ${process.env.PORT}`)
// );
//# sourceMappingURL=app.js.map