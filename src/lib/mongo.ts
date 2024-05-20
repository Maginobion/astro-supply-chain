import { connect, type ConnectOptions } from "mongoose";

if (!import.meta.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = import.meta.env.MONGODB_URI;
const options: ConnectOptions = {};
let cachedMongo: typeof import("mongoose");

declare global {
  var _mongoConnection: typeof import("mongoose");
}

export const getMongo = async () => {
  if (import.meta.env.NODE_ENV === "development") {
    if (!global._mongoConnection) {
      global._mongoConnection = await getDBConnection();
      cachedMongo = global._mongoConnection;
    }
    return cachedMongo;
  }
  return getDBConnection();
};

const getDBConnection = async () => await connect(uri, options);