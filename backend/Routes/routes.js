const express = require("express");
const router = express.Router();
const MenuController = require("../Controllers/MenuControl.js");
const UserController = require("../Controllers/UserControl.js");
const BookingController = require("../Controllers/BookingControl.js");
const ChefController = require("../Controllers/ChefControl.js");
const AuthControl = require("../Controllers/authControl");
const NewsletterController = require("../Controllers/NewsletterControl");
const ContactController = require("../Controllers/ContactControl");

//------------------------------ Menu Routes-----------------------------------
router.get("/menu", MenuController.getMenu);
router.post(
  "/menu",
  UserController.accountInfo,
  UserController.adminAccess,
  MenuController.addNewDish
);
router.put(
  "/menu/:id",
  UserController.accountInfo,
  UserController.adminAccess,
  MenuController.updateDish
);
router.patch("/menu/:id", MenuController.updateDishQuantity);
router.get("/menu/type/:type", MenuController.getDishByType);

//-------------------------------Chefs Routes----------------------------------
router.get("/chefs", ChefController.getChefs);
router.post("/chefs", ChefController.addNewChef);
router.put("/chefs/:id", ChefController.updateChef);
router.delete("/chefs/:id", ChefController.deleteChef);

// ------------------------------User Routes-----------------------------------
router.post("/user", UserController.addNewUser);
router.post("/user/login", UserController.LoginUser);
router.get("/user/profile", UserController.getProfile);
router.put("/user/profile", UserController.updateProfile);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);
router.post("/user/vip", UserController.registerVIP);

//------------------------------- Auth Routes ----------------------------------
router.post("/request-reset", AuthControl.requestReset);
router.post("/verify-code", AuthControl.verifyCode);
router.post("/reset-password", AuthControl.resetPassword);

// ------------------------------ Booking Routes ----------------------------------
router.post("/booking", BookingController.createBooking);
router.get(
  "/bookings",
  UserController.accountInfo,
  UserController.adminAccess,
  BookingController.getBookings
);
router.delete(
  "/booking/:id",
  UserController.accountInfo,
  UserController.adminAccess,
  BookingController.deleteBooking
);
// ------------------------------ Newsletter Routes ----------------------------------
router.post("/api/subscribe", NewsletterController.subscribe);
// Contact form
router.post("/contact", ContactController.sendContact);

module.exports = router;
