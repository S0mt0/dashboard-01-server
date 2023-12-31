import { Document, Model, FilterQuery } from "mongoose";
import { StatusCodes as status } from "http-status-codes";

import { IMongoDocsLib } from "../../types/classes";
import { errorResponse } from "../../setup";

export class DbLib<D extends Partial<Document>, F, M extends Model<D, {}, F>>
  implements IMongoDocsLib<D, F, M>
{
  public document: D | null = null;

  constructor(
    protected model: M,
    public libName: string
  ) {
    this.model = model;
    this.libName = libName;
  }

  public docExists = async (query: FilterQuery<D>): Promise<boolean> => {
    return Boolean(await this.model.findOne(query));
  };

  public addDoc = async (
    data: Partial<D>,
    query: FilterQuery<D>,
    message?: string
  ): Promise<D> => {
    const docExists = await this.docExists({ ...query });

    if (docExists) {
      return errorResponse(
        { message: message || `${this.libName} already exists` },
        status.CONFLICT
      );
    }
    const doc = await this.model.create(data);

    this.document = doc.toObject();

    return doc.toObject();
  };

  public deleteDoc = async (query: FilterQuery<D>): Promise<boolean> => {
    const res = await this.model.findOneAndDelete(query);

    if (res) {
      this.document = null;
      return true;
    }

    return false;
  };

  public deleteManyDocs = async (query?: FilterQuery<D>): Promise<boolean> => {
    const { acknowledged, deletedCount } = await this.model.deleteMany(query);

    if (acknowledged) {
      this.document = null;
      return true;
    }

    return false;
  };

  public findAndUpdateDoc = async (
    query: FilterQuery<D>,
    data: Partial<D>,
    filters?: string
  ): Promise<D> => {
    const updatedDoc = await this.model
      .findOneAndUpdate(
        query,
        { ...data },
        {
          new: true,
          runValidators: true,
        }
      )
      .select(filters);

    this.document = updatedDoc;

    return updatedDoc;
  };

  public findOneDoc = async (
    query: FilterQuery<D>,
    filters?: string
  ): Promise<D> => {
    const doc = await this.model.findOne(query).select(filters);
    this.document = doc;

    return doc;
  };

  public findAllDocs = async (
    query?: FilterQuery<D>,
    filters?: string,
    sortList?: string
  ): Promise<D[]> => {
    let result = this.model.find(query);

    if (filters) {
      result = result.select(filters);
    }

    if (sortList) {
      result = result.sort(sortList);
    } else {
      result = result.sort("-createdAt"); // By default, records will be sorted by time of creation, in descending order i.e from newest to oldest
    }

    const allDocs = await result;

    return allDocs;
  };
}
