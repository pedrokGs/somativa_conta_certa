import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

if(!MONGO_URI){
    throw new Error("Crie o arquivo .env.local com a variável DATABASE_URL");
}

let cached = (global as any).mongoose;

if(!cached){
    cached = (global as any).mongoose = {conn:null, promise: null};
}

async function connectMongo(){
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        const aguarde = {bufferCommands: false};
        cached.promise = mongoose.connect(MONGO_URI!, aguarde).then((mongoose)=>{console.log("Conectado ao Mongo"); return mongoose})
    }
    try{
        cached.conn = await cached.promise;    
    }catch(error){
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectMongo;

// mongoose bcrypt, jsonwebtoken
// npm i mongoose bcrypt jsonwebtoken