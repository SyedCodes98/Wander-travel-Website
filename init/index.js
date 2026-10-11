const mongoose = require("mongoose");
const indata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/te";
main().then(()=>{
    console.log("connected to DB");
    
}).catch(err =>{
    console.log(err);
    
})
async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDb = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(indata.data);
console.log("Data was initialized");

};
initDb();