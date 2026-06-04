import { test as base } from "../src/api-request/api-request-fixture";
import { connectToMongo } from "@utils/mongoClient";
import { Db } from "mongodb";

type Fixtures = {
  db1: Db;          // // update this to the relevant db name
  db2: Db; // update this to the relevant db name
};

export const test = base.extend<Fixtures>({
  db1: async ({}, use, testInfo) => {
    const dbName = process.env.MONGO_DB_NAME ?? "mongoDbName";
    const db = await connectToMongo(dbName);
    console.log(
      `✅ [${testInfo.title}] Connected to Mongo collection`,
      db.databaseName,
    );
    await use(db);
  },

  db2: async ({}, use, testInfo) => {
    const differentMongoDB = process.env.MONGO_DIFF_DB_NAME ?? "mongoDbName";
    const db = await connectToMongo(differentMongoDB);
    console.log(
      `✅ [${testInfo.title}] Connected to Mongo [differentMongoDB] collection`,
      db.databaseName,
    );
    await use(db);
  },
});

export const expect = test.expect