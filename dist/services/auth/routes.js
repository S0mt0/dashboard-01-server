"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("../../setup");
const validation_schema_1 = require("./validation-schema");
const auth = __importStar(require("./handlers"));
/**
 * @public
 * @description Unprotected routes for authentication.
 * @returns Routes
 */
exports.default = (router) => {
    // sign-up route
    router.post("/auth/sign-up", (0, setup_1.validate)(validation_schema_1.signUpPayload), (0, setup_1.controller)(auth.signUpHandler));
    // login route
    router.post("/auth/sign-in", (0, setup_1.validate)(validation_schema_1.signInPayload), (0, setup_1.controller)(auth.signInHandler));
    // logout route
    router.get("/auth/sign-out", (0, setup_1.controller)(auth.signOutHandler));
    // refresh-token route
    router.get("/auth/refresh-token", (0, setup_1.controller)(auth.refreshTokenHandler));
};
//# sourceMappingURL=routes.js.map