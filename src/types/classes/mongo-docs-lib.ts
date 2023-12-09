import { Document, Model, FilterQuery } from "mongoose";

export interface IMongoDocsLib<D extends Document, M extends Model<D>> {
  model: M;
  document: D;
  libName: string;

  docExists: (query: FilterQuery<D>) => Promise<boolean>;
  addDoc: (data: D) => Promise<IMongoDocsLib<D, M>>;
  deleteDoc: (query: FilterQuery<D>) => Promise<IMongoDocsLib<D, M>>;
  updateDoc: (query: FilterQuery<D>, data: D) => Promise<D>;
  findOneDoc: (query: FilterQuery<D>, filters?: string) => Promise<D>;
  findAllDocs: (
    query?: FilterQuery<D>,
    filters?: string,
    sortList?: string
  ) => Promise<Array<D>>;
}
