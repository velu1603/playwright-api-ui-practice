import fs from "fs";
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;

function ensureFileExists(path: string | undefined, varName: string) {
  if (!path) {
    throw new Error(`${varName} is not set. Check your .env`);
  }
  if (!fs.existsSync(path)) {
    throw new Error(`${varName} points to a file that does not exist: ${path}`);
  }
}

function sanitizeUriHost(uri: string): string {
  try {
    const u = new URL(uri);
    console.log("Mongo client hostname = ", u.hostname);

    return `${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`; 
  } catch {
    return "<unparseable-uri>";
  }
}

/**
 * Connect to Mongo and return the database.
 * Reuses a singleton client to avoid creating multiple connections
 */
export async function connectToMongo(dbNameOverride?: string): Promise<Db> {
  const rawUri = process.env.MONGO_URI;

  // normalize HTML-escaped ampersands
  const uri = rawUri?.replace(/&amp;+/g, "&");

  if (!uri) {
    throw new Error(
      "NONGO_URI is not set. Check your .env and dotenv.config() order",
    );
  }

  // Validate scheme to avaoid 'Invalid scheme' MongoParseError
  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    throw new Error(
      `NONGO_URI must start with 'mongodb://' or "mongodb+srv://". Got ${uri} `,
    );
  }

  const dbName = dbNameOverride || process.env.MONGO_DB_NAME;

  if (!dbName) {
    throw new Error("Mongo Database name not provided");
  }

  //  TLS and certs: only validate files if tls is enabled in client options
  // we'll enable TLS by default here to match original config
  const tlsEnabled = true;

  if (tlsEnabled) {
    ensureFileExists(process.env.MONGO_CA_PATH, "MONGO_CA_PATH");
    ensureFileExists(process.env.MONGO_CLIENT_PATH, "MONGO_CLIENT_PATH");
  }

  if (!client) {
    const hostForLogs = sanitizeUriHost(uri);
    console.log(`[mongoClient] connectiong to ${hostForLogs}`);
    client = new MongoClient(uri, {
      authMechanism: "SCRAM-SHA-1",
      tls: tlsEnabled,
      tlsCAFile: process.env.MONGO_CA_PATH,
      tlsCertificateKeyFile: process.env.MONGO_CLIENT_PATH,
      tlsAllowInvalidHostnames: true, // Useful in non-prod when cert CN/SAN does not match hostname
      directConnection: true,
      serverSelectionTimeoutMS: 10000,
    });

    try {
      await client.connect();
      console.log(`[mongoClient] connecting to ${hostForLogs}`);
    } catch (e) {
      console.error(`[mongoClient] Connection failed ❌`);
      // Reset client so a future retry can create a new instance
      client = null;
      throw e;
    }
  } else {
    //  optional: sanity ping to confirm cached client is still alive
    try {
      await client.db(dbName).admin().ping(); // If ping succeeds , we're good
    } catch (e) {
      console.warn(
        "[MongoCLient] existing client ping failed; recrearting client ..",
        e,
      );
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      client = null;
      return connectToMongo(dbNameOverride);
    }
  }
  return client.db(dbName);
}

/**
 * Close the singleton MongoClient if it exists.
 * Safe to call multiple times
 */
export async function closeMongoConnection(): Promise<void> {
  if (!client) {
    console.log("[mongoClient] No client to close (already null).");
    return;
  }

  console.log("[mongoClient] Closing client");
  try {
    await client.close();
    console.log("✅ [mongoClient] Closing client");
  } catch (e) {
    console.error("❌ [mongoClient] Error Closing client", e);
  } finally {
    client = null;
  }
}


/**
 * Optional: Verify that the client is truly closed by attempting a ping 
 * Returns true if we are confident the client is closed
 * Note: If other module kept its own Mongoclient reference, this cannot detect that,
 *  ensure you centralize via connectToMongo()
 */
export async function verifyClosed():Promise<Boolean> {
    
    try{
        // If client is null (as expected after close), this will not work
        // We deliberately try to use it; if it somehow works, thats a problem
        await client?.db().admin().ping()
        console.error("❌ [mongoClient] Ping unexpectedly succeeded after close");
        return false
    }catch{
        console.log("✅ [mongoClient] Verified closed (ping failed as expected");
        return true
    }
    
    
}
