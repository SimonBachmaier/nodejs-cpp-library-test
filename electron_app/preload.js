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
  // Run test
  let testNumber = 0;
  const t1 = Date.now();
  for (let i = 0; i < 10000000; i++) {
    testNumber = lib.AddOne(testNumber);
  }
  const t2 = Date.now();

  replaceText('hello-message', `Test took ${(t2-t1)}ms`);

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