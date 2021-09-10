const { Router } = require("express");
const authenticatoinController = require("../controllers/authenticatoinController");
const replyController = require("../controllers/replyController");
const router = Router({ mergeParams: true });
//POST /ticket/23242dd3/rply
//post/reply
router.post(
  "/",
  authenticatoinController.protect,
  authenticatoinController.restrictTo("admin", "customer", "customer-service"),
  replyController.createReply
);
router.get("/", replyController.getAllReplies);

router.patch(
  "/:id",
  authenticatoinController.protect,

  replyController.updateReply
);
router.delete("/:id", replyController.deleteReply);

module.exports = router;
