const express = require("express");
const {checkUser} = require("../middlewares/cookiesVaildation")
const {
  getRegister,
  getLogin,
  postRegister,
  postLogin,
  getHome,
  getAds,
  postAds,
  getDetail,
  getService,
  getAbout,
  getAccountFavourite,
  getAccountMy,
  getAccountProfile,
  getAdlistingGrid,
  getAdlistingList,
  getBlogGrid,
  getBlogLeft,
  getBlog,
  getCategory,
  getContact,
  getDashboard,
  getFaq,
  getForgetPassword,
  getOfferMessage,
  getPayment,
  getPricing,
  getSinglePost,
  getTestimonial,
  postContact,
  getIndex2,
  logout
} = require("../controllers/control");

const router = express.Router();

router.get("/",checkUser, getHome);
router.get("/post-ads", checkUser, getAds);
router.get("/register", getRegister);
router.get("/login",  getLogin);
router.post("/login", checkUser, postLogin);
router.post("/register", checkUser, postRegister);
router.post("/post-ads", checkUser, postAds);
router.get("/adsDetail/:id", checkUser, getDetail);
router.get("/services", checkUser, getService);
router.get("/about", checkUser, getAbout);
router.get("/account-favourite-ads", checkUser, getAccountFavourite);
router.get("account-myads", checkUser, getAccountMy);
router.get("/account-profile-setting", checkUser, getAccountProfile);
router.get("/adlistinggrid", checkUser, getAdlistingGrid);
router.get("/adlistinglist", checkUser, getAdlistingList);
router.get("/blog-grid-full-width", checkUser, getBlogGrid);
router.get("/blog-left-sidebar", checkUser, getBlogLeft);
router.get("/blog", checkUser, getBlog);
router.get("/category", checkUser, getCategory);
router.get("/contact", checkUser, getContact);
router.get("/dashboard", checkUser, getDashboard);
router.get("/faq", checkUser, getFaq);
router.get("/forgot-password", checkUser, getForgetPassword);
router.get("/offermessage", checkUser, getOfferMessage);
router.get("/payments", checkUser, getPayment);
router.get("/pricing", checkUser, getPricing);
router.get("/single-post", checkUser, getSinglePost);
router.get("/testimonial", checkUser, getTestimonial);
router.get("/index-2", checkUser, getIndex2)
router.post("/contact", checkUser, postContact);
router.get("/logout",checkUser, logout)


module.exports = router;
