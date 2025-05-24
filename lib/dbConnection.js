import { MongoClient } from "mongodb";

const uri = process.env.DB_URI;
const options = {};



let client;
let clientPromise;

// check if we are in development or production
if (process.env.NODE_ENV === "development") {
    // create a new MongoClient
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
} else {
    // use a global client
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
}
// export the client promise
export default clientPromise;