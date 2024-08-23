// 導入 mongoose 套件
const mongoose = require("mongoose");

// 定義聯絡我們模型
const feedbackSchema = new mongoose.Schema(
  {
    // 名稱
    contactPerson: { type: String, required: [true, "姓名未填寫"] },
    // 電話
    phone: { type: String },
    // 信箱
    email: { type: String, required: [true, "信箱未填寫"] },
    // 內容
    feedback: { type: String, required: [true, "內容未填寫"] },
    // 從哪裡得知此網站
    source: {
      type: String,
      enum: ["網路搜尋", "社群媒體", "親友介紹", "其他"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// 創建評價模型
const Feedback = mongoose.model("Feedback", feedbackSchema);

// 導出
module.exports = Feedback;
