const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
      mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB ONLINE");
  } catch (error) {
    console.log(error);
    throw new Error("");
  }
};

module.exports = {
  dbConnection,
};
