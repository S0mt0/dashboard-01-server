"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbLib = void 0;
const http_status_codes_1 = require("http-status-codes");
const setup_1 = require("../../setup");
class DbLib {
    constructor(model, libName) {
        this.model = model;
        this.libName = libName;
        this.document = null;
        this.docExists = async (query) => {
            return Boolean(await this.model.findOne(query));
        };
        this.addDoc = async (data, query, message) => {
            const docExists = await this.docExists(Object.assign({}, query));
            if (docExists) {
                return (0, setup_1.errorResponse)({ message: message || `${this.libName} already exists` }, http_status_codes_1.StatusCodes.CONFLICT);
            }
            const doc = await this.model.create(data);
            this.document = doc.toObject();
            return doc.toObject();
        };
        this.deleteDoc = async (query) => {
            const res = await this.model.findOneAndDelete(query);
            if (res) {
                this.document = null;
                return true;
            }
            return false;
        };
        this.deleteManyDocs = async (query) => {
            const { acknowledged, deletedCount } = await this.model.deleteMany(query);
            if (acknowledged) {
                this.document = null;
                return true;
            }
            return false;
        };
        this.findAndUpdateDoc = async (query, data, filters) => {
            const updatedDoc = await this.model
                .findOneAndUpdate(query, Object.assign({}, data), {
                new: true,
                runValidators: true,
            })
                .select(filters);
            this.document = updatedDoc;
            return updatedDoc;
        };
        this.findOneDoc = async (query, filters) => {
            const doc = await this.model.findOne(query).select(filters);
            this.document = doc;
            return doc;
        };
        this.findAllDocs = async (query, filters, sortList) => {
            let result = this.model.find(query);
            if (filters) {
                result = result.select(filters);
            }
            if (sortList) {
                result = result.sort(sortList);
            }
            else {
                result = result.sort("-createdAt"); // By default, records will be sorted by time of creation, in descending order i.e from newest to oldest
            }
            const allDocs = await result;
            return allDocs;
        };
        this.model = model;
        this.libName = libName;
    }
}
exports.DbLib = DbLib;
//# sourceMappingURL=db-lib.js.map