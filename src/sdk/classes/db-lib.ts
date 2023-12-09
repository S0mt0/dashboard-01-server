import { Document, Model, FilterQuery } from "mongoose";
import { StatusCodes as status } from "http-status-codes";

import { errorResponse } from "../../utils";
import { IMongoDocsLib } from "../../types/classes";

export class DbLib<D extends Document, M extends Model<D>>
  implements IMongoDocsLib<D, M>
{
  document: D | null = null;

  constructor(
    public model: M,
    public libName: string
  ) {
    this.model = model;
    this.libName = libName;
  }

  public docExists = async (query: FilterQuery<D>): Promise<boolean> => {
    return Boolean(await this.model.findOne(query));
  };

  public addDoc = async (data: D): Promise<IMongoDocsLib<D, M>> => {
    if (await this.docExists({ data })) {
      errorResponse(
        { message: `${this.libName} already exists` },
        status.CONFLICT
      );
    }

    const doc = await this.model.create(data);
    this.document = doc;

    return this;
  };

  public deleteDoc = async (
    query: FilterQuery<D>
  ): Promise<IMongoDocsLib<D, M>> => {
    await this.model.findOneAndDelete(query);
    this.document = null;

    return this;
  };

  public updateDoc = async (query: FilterQuery<D>, data: D): Promise<D> => {
    const updatedDoc = await this.model.findOneAndUpdate(
      query,
      { data },
      {
        new: true,
        runValidators: true,
      }
    );
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
      result = result.sort("-createdAt"); // By default, records will be sorted in descending order i.e from newest to oldest
    }

    const allDocs = await result;

    return allDocs;
  };
}
