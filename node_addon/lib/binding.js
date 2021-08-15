const addon = require('../build/Release/crossPlatformLibraryNative');

exports.HelloMessage = addon.HelloMessage;
exports.AddOne = addon.AddOne;
exports.OpenDatabaseConnection = addon.OpenDatabaseConnection;
exports.CloseDatabaseConnection = addon.CloseDatabaseConnection;
exports.SetupTestData = addon.SetupTestData;
exports.GetAllUsers = addon.GetAllUsers;
exports.GetAllArticles = addon.GetAllArticles;