const configDB = require("../../Config/database");
const mongoose = require("mongoose");

async  function connect() {
    try {

        await mongoose.connect(
            configDB.url,
            { useNewUrlParser: true,useFindAndModify: false }
        );
        console.log("connected");
    }catch (e) {
        console.error(e);
    }
}
module.exports={connect};
