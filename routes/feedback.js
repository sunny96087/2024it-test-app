const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const handleSuccess = require("../utils/handleSuccess");
const handleErrorAsync = require("../utils/handleErrorAsync");
const appError = require("../utils/appError");

// 新增 feedback
router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const { contactPerson, phone, email, feedback } = req.body;

    // 必填欄位驗證
    if (!contactPerson || !email || !feedback) {
      // 使用 appError 函式創建錯誤物件
      // 狀態碼為 400，錯誤訊息為 "姓名、信箱、內容為必填欄位"
      return next(appError(400, "姓名、信箱、內容為必填欄位"));
    }

    const newFeedback = await Feedback.create({
      contactPerson,
      phone,
      email,
      feedback,
    });

    // 使用 handleSuccess 函式處理成功回應
    // 狀態碼為 201，回應中包含新創建的 feedback 資料和成功訊息
    handleSuccess(res, newFeedback, "新增成功", 201);
  })
  /*  #swagger.tags = ['Feedback']
    #swagger.summary = '新增回饋'
    #swagger.description = '新增回饋'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema:{
            $contactPerson:'姓名',
            $phone:'電話',
            $email: '信箱',
            $feedback: '內容',
            $source: '從哪裡得知此網站',
        }
    }
*/
);

// 取得所有 feedback
router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    // 使用 find() 方法從資料庫中取得所有 feedbacks
    const feedbacks = await Feedback.find();

    handleSuccess(res, feedbacks, "取得所有 feedbacks 成功", 200);
  })
);

// 取得指定 id feedback
router.get(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    // 使用 findById 方法從資料庫中取得指定 id 的 feedback
    const feedback = await Feedback.findById(req.params.id);

    // 如果找不到該 id 對應的資料，回應 404 錯誤狀態和錯誤訊息
    if (!feedback) {
      return next(appError(404, "找不到該 feedback"));
    }

    // 成功取得資料後，回應 200 狀態碼和回傳的資料
    handleSuccess(res, feedback, "取得指定 id 的 feedback 成功", 200);
  })
);

// 更新指定 id feedback
router.patch(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    // 檢查必填欄位是否存在
    const { contactPerson, email, feedback } = req.body;
    if (!contactPerson || !email || !feedback) {
      return next(appError(400, "姓名、信箱、內容為必填欄位"));
    }

    // 使用 findByIdAndUpdate 更新資料
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id, // 從 URL 參數中獲取要更新的資料 ID
      req.body, // 使用請求 body 中的資料進行更新
      {
        new: true, // 返回更新後的資料
        runValidators: true, // 在更新時執行驗證
      }
    );

    // 如果找不到該資料，回應 404 錯誤
    if (!updatedFeedback) {
      return next(appError(404, "找不到該 feedback"));
    }

    // 成功更新後回應 200 狀態和更新後的資料
    handleSuccess(res, updatedFeedback, "更新成功", 200);
  })
);

// 刪除指定 id feedback
router.delete(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    // 使用 findByIdAndDelete 根據 URL 中的 id 參數查找並刪除對應的 feedback
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    // 如果找不到對應的 feedback（即該 id 不存在），回應 404 錯誤
    if (!feedback) {
      return next(appError(404, "找不到該 feedback"));
    }

    // 如果成功刪除，回應 200 狀態碼，表示成功操作
    handleSuccess(res, null, "刪除成功", 200);
  })
);

module.exports = router;
