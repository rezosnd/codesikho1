import { MongoClient, type Db, type Collection } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

console.log("MongoDB URI check:", {
  hasUri: !!uri,
  uriStart: uri.substring(0, 20) + "...",
})

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
    globalWithMongo._mongoClientPromise
      .then(() => console.log("MongoDB connected successfully (development)"))
      .catch((error) => console.error("MongoDB connection failed:", error))
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  clientPromise
    .then(() => console.log("MongoDB connected successfully (production)"))
    .catch((error) => console.error("MongoDB connection failed:", error))
}

export default clientPromise

// Database and collection helpers
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("coding_platform")
}

export async function getUsersCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("users")
}

export async function getQuizResultsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("quiz_results")
}

export async function getCodingResultsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("coding_results")
}

export async function getActivityCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("user_activity")
}

export async function getUserActivityCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection("user_activity")
}
