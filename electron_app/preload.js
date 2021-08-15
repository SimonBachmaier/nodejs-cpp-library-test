const lib = require('../node_addon');

window.addEventListener('DOMContentLoaded', () => {
    replaceText('hello-message', lib.HelloMessage('Node.js'));
    document.getElementById('showArticlesButton').addEventListener('click', showArticlesAndRunTest);
});

function replaceText (selector, text) {
  const element = document.getElementById(selector)
  if (element) element.innerText = text
}

function showArticlesAndRunTest() {
  // Run function call performance test
  const iterations = 10000000;
  let testNumber = 0;
  let t1 = Date.now();
  for (let i = 0; i < iterations; i++) {
    testNumber = lib.AddOne(testNumber);
  }
  let t2 = Date.now();
  const cppTime = t2 - t1;

  testNumber = 0;
  t1 = Date.now();
  for (let i = 0; i < iterations; i++) {
    testNumber = AddOne(testNumber);
  }
  t2 = Date.now();
  const jsTime = t2 - t1;

  replaceText('hello-message', `C++ test took ${cppTime}ms. JS test took ${jsTime}ms.`);

  /**
   * Connect to database and read data
   */
  lib.OpenDatabaseConnection("my-electron.db");
  lib.SetupTestData();
  const users = lib.GetAllUsers().users;
  let articles = lib.GetAllArticles().articles;
  lib.CloseDatabaseConnection();
  for (let article of articles) {
      for (let user of users) {
          if (article.authorId == user.id) article["userName"] = user.name;
      }
  }
  replaceText('articles', 'articles: \n' + JSON.stringify(articles, null, 2));
}

function AddOne(x) {
  return x + 1;
}