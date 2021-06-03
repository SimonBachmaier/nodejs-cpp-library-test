const addon = require('../build/Release/cross-platform-library-native');

exports.HelloMessage = addon.HelloMessage;
exports.OpenDatabaseConnection = addon.OpenDatabaseConnection;
exports.CloseDatabaseConnection = addon.CloseDatabaseConnection;
exports.SetupTestData = addon.SetupTestData;
exports.GetAllUsers = addon.GetAllUsers;
exports.GetAllArticles = addon.GetAllArticles;

