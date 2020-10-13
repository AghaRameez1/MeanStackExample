var config = {};


config.mongoose = process.env.MONGODB || 'None';
config.secret = process.env.SECRET || 'None';
module.exports = config