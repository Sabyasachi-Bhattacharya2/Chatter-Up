import mongoose from 'mongoose';

export const connect = async() => {
    const muri = "mongodb+srv://bhattacharyasabyasachi2:DeltaBetaGamma@cluster0.ec3zkm1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    if(!muri) {
        console.log(typeof(muri));
        throw new Error(`muri is ${muri}`);
    }
    await mongoose.connect(muri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database is connected"))
    .catch(err => console.log(err));
}