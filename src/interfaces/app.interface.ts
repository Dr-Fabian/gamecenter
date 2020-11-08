import * as mongoose from "mongoose";

export default interface App {
  database: typeof mongoose,
  modules: any,
}