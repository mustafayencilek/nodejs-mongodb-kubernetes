const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer();

module.exports.dbConnect = async () => {
  await mongoServer.start();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

module.exports.dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
