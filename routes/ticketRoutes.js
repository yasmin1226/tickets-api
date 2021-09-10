const express = require("express");
const router = express.Router();
const authenticatoinController = require("../controllers/authenticatoinController");

const ticketController = require("./../controllers/ticketController");
const replyRouter = require("../routes/replyRoutes");

//POST /ticket/23242dd3/reply
//Get/ticket/23242dd3/reply
//GET /ticket/23242dd3/reply/232d4

//router.post("/:ticketId/reply", userAuth, replyController.createReply);

//router.get("/:ticketId/reply");
router.use("/:ticketId/reply", replyRouter);
router.get(
  "/myTickets",
  authenticatoinController.protect,
  authenticatoinController.restrictTo("customer"),
  ticketController.myTickets,
  ticketController.getAllTickets
);
router
  .route("/")
  .get(
    authenticatoinController.protect,
    authenticatoinController.restrictTo("admin", "customer-service"),
    ticketController.getAllTickets
  )

  .post(
    authenticatoinController.protect,
    authenticatoinController.restrictTo("customer"),
    ticketController.createTicket
  );

router
  .route("/:id")
  .get(ticketController.getOneTicket)
  .patch(
    authenticatoinController.protect,
    authenticatoinController.restrictTo(
      "admin",
      "customer-service",
      "customer"
    ),
    ticketController.updateTicket
  )
  .delete(
    authenticatoinController.protect,
    authenticatoinController.restrictTo("admin"),
    ticketController.deleteTicket
  );
module.exports = router;
