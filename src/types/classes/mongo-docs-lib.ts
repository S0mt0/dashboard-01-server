import { Document, Model, FilterQuery } from "mongoose";

export interface IMongoDocsLib<
  D extends Partial<Document>,
  F,
  M extends Model<D, {}, F>,
> {
  document: D;

  docExists: (query: FilterQuery<D>) => Promise<boolean>;
  addDoc: (data: D) => Promise<D>;
  deleteDoc: (query: FilterQuery<D>) => Promise<IMongoDocsLib<D, F, M>>;
  updateDoc: (query: FilterQuery<D>, data: D) => Promise<D>;
  findOneDoc: (query: FilterQuery<D>, filters?: string) => Promise<D>;
  findAllDocs: (
    query?: FilterQuery<D>,
    filters?: string,
    sortList?: string
  ) => Promise<Array<D>>;
}
