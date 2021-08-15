#include <napi.h>
#include "libs/cross-platform-library.h"

Napi::Value HelloMessage(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1 || !info[0].IsString())
  {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return env.Undefined();
  }  

  return Napi::String::New(env, cpl::HelloMessage(info[0].ToString()));
}

Napi::Value AddOne(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), cpl::AddOne(info[0].ToNumber()));
}

Napi::Value OpenDatabaseConnection(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() != 1 || !info[0].IsString() || (((std::string)info[0].ToString()).find(".db") == std::string::npos))
  {
    Napi::TypeError::New(env, "Path to database expected").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  std::string* err = nullptr;
  cpl::Database& db = cpl::Database::GetInstance();
  if (db.CreateConnection(info[0].ToString(), err) == false)
    return Napi::String::New(env, err->c_str());

  return env.Undefined();
}

Napi::Value CloseDatabaseConnection(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  std::string err;
  cpl::Database& db = cpl::Database::GetInstance();
  if (db.CloseConnection() == false)
    err = "Error closing database.";

  return Napi::String::New(env, err.c_str());
}

Napi::Value SetupTestData(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  cpl::Database& db = cpl::Database::GetInstance();
  db.SetupTestData();

  return env.Undefined();
}

Napi::Value GetAllUsers(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  cpl::Database& db = cpl::Database::GetInstance();
  std::vector<cpl::User> users;
  db.GetAllUsers(&users);

  Napi::Object returnObject = Napi::Object::New(env);
  Napi::Array usersArray = Napi::Array::New(env);
  int index = 0;
  for (cpl::User user: users) {
    Napi::Object userObject = Napi::Object::New(env);
    userObject.Set("id", user.id);
    userObject.Set("name", user.name);
    usersArray.Set(index, userObject);
    index += 1;
  }
  returnObject.Set("users", usersArray);
  return returnObject;
}

Napi::Value GetAllArticles(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  cpl::Database& db = cpl::Database::GetInstance();
  std::vector<cpl::Article> articles;
  db.GetAllArticles(&articles);

  Napi::Array articlesArray = Napi::Array::New(env);
  int index = 0;
  for (cpl::Article article: articles) {
    Napi::Object articleObject = Napi::Object::New(env);
    articleObject.Set("id", article.id);
    articleObject.Set("authorId", article.author_id);
    articleObject.Set("headline", article.headline);
    articleObject.Set("content", article.content);
    articlesArray.Set(index, articleObject);
    index += 1;
  }

  Napi::Object returnObject = Napi::Object::New(env);
  returnObject.Set("articles", articlesArray);
  return returnObject;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "HelloMessage"),
              Napi::Function::New(env, HelloMessage));
  exports.Set(Napi::String::New(env, "AddOne"),
              Napi::Function::New(env, AddOne));
  exports.Set(Napi::String::New(env, "OpenDatabaseConnection"),
              Napi::Function::New(env, OpenDatabaseConnection));
  exports.Set(Napi::String::New(env, "CloseDatabaseConnection"),
              Napi::Function::New(env, CloseDatabaseConnection));
  exports.Set(Napi::String::New(env, "SetupTestData"),
              Napi::Function::New(env, SetupTestData));
  exports.Set(Napi::String::New(env, "GetAllUsers"),
              Napi::Function::New(env, GetAllUsers));
  exports.Set(Napi::String::New(env, "GetAllArticles"),
              Napi::Function::New(env, GetAllArticles));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
