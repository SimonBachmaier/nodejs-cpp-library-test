const assert = require("assert");

const lib = require("../lib/binding.js");

function testBasic()
{
    const result =  lib.HelloMessage("Node.js")
    assert.strictEqual(result, "Hello from C++ and Node.js", "Unexpected value returned");

    console.log("OpenDatabaseConnection", lib.OpenDatabaseConnection("./test/my_test.db"));
    console.log("SetupTestData", lib.SetupTestData());
    const users = lib.GetAllUsers().users;
    assert.strictEqual(users.length, 2);
    let articles = lib.GetAllArticles().articles;
    assert.strictEqual(articles.length, 5);
    for (let article of articles) {
        for (let user of users) {
            if (article.authorId == user.id) article["userName"] = user.name;
        }
    }
    console.log(users);
    console.log(articles);
    console.log("CloseDatabaseConnection", lib.CloseDatabaseConnection());
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");