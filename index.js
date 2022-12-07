// DotEnv
import DotEnv from 'dotenv'


// Configure environment variables if not in production.
if (process.env.NODE_ENV !== 'production') {
    DotEnv.config()
    console.log('Development configuration complete.')
}

// Mongo
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.URI);

// Fetch all products
let products

(async () => {
    try {
        products = client.db(process.env.DB).collection(process.env.COLLECTION);
    } catch {
        console.log("Couldn't connect to database, something went wrong.")
    };
})()

// Express
import Express from 'express'

// Setup an express app.
const APP = Express()

// Set express to use json and extended url encoding to read bodies of incoming requests
APP.use(Express.json());
APP.use(Express.urlencoded({ extended: true }));

// Get the environment port.
const PORT = process.env.PORT || 3000

// Import the express routers
import { Part1 } from "./part1.js"
import { Part2 } from "./part2.js"
import { Part3 } from "./part3.js"

// Set express to use the imported routers
APP.use(Part1);
APP.use(Part2);
APP.use(Part3);

// Start listening for incoming requests.
APP.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`)
})

// Export the following objects so each of our parts can import/use them
export { APP, Express, ObjectId, products }


