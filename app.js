var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var cors = require("cors"); // 引入允許跨網域套件 cors

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const feedbackRoute = require("./routes/feedback");
const freshfoodRoute = require("./routes/freshFood");
const foodRoute = require("./routes/food");

const mongoose = require("mongoose");

// 將 .env 檔案中的變數載入到 process.env 中
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

var app = express();

// 程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(err);
  process.exit(1);
});

// ? 連接資料庫
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("資料庫連接成功"))
  .catch((err) => {
    console.log("MongoDB 連接失敗:", err);
  });

app.use(cors()); // 全部放行

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/feedbacks", feedbackRoute);
app.use("/freshfoods", freshfoodRoute);
app.use("/foods", foodRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 404 錯誤
app.use(function (req, res, next) {
  // 回應一個包含錯誤訊息的 JSON 對象
  res.status(404).json({
    status: "error",
    message: "無此路由資訊",
    path: req.originalUrl, // 提供更多的上下文信息
  });
});

// * 開發環境 錯誤處理
const resError = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resError(err, res);
  }

  resError(err, res);
});

// 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", err);
});

// 導出給 ./bin/www 使用
module.exports = app;
