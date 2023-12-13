import { Document, Model, FilterQuery } from "mongoose";

export interface IMongoDocsLib<
  D extends Partial<Document>,
  F /** "F" is a generic type representing typeof schema methods */,
  M extends Model<D, {}, F>,
> {
  document: D;
  docExists: (query: FilterQuery<D>) => Promise<boolean>;
  addDoc: (data: D, query: FilterQuery<D>) => Promise<D>;
  deleteDoc: (query: FilterQuery<D>) => Promise<boolean>;
  deleteManyDocs: (query: FilterQuery<D>) => Promise<boolean>;
  findAndUpdateDoc: (query: FilterQuery<D>, data: D) => Promise<D>;
  findOneDoc: (query: FilterQuery<D>, filters?: string) => Promise<D>;
  findAllDocs: (
    query?: FilterQuery<D>,
    filters?: string,
    sortList?: string
  ) => Promise<Array<D>>;
}
