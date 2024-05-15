const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/auth");
const productModel = require("../model/product");
const contactModel = require("../model/contact");
const { spName } = require("../middlewares/upload");

const getHome = async (req, res) => {
try {
  if (req.user) {
    const product = await productModel.find();
  const productInfo = await product.map((item) => {
    return {
            ...item.toObject(),
            showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
          };
        });
    res.render("index", { productInfo });
  } else {
    const product = await productModel.find();
    const productInfo = await product.map((item) => {
      return {
              ...item.toObject(),
              showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
            };
          });
    res.render("index", {productInfo});
  }
} catch (err) {
  console.log(err.message);
}
};

const postRegister = async (req, res) => {
  const { userName, email, password, retypePassword } = req.body;

  const checkF = ["userName", "email", "password", "retypePassword"];
  const emptyAuth = [];
  for (const auth of checkF) {
    if (!req.body[auth] || req.body[auth] === "") {
      emptyAuth.push(auth);
    }
  }
  if (emptyAuth.length < 0) {
    return res.render("register", {
      error: `This field(s) ${emptyAuth.join(", ")} cannot be empty`,
    });
  }

  if (password !== retypePassword) {
    return res.render("register", {
      error: "email and password Mismatch",
    });
  }
  const checkEmail = await userModel.findOne({ email: email });
  if (checkEmail) {
    return res.render("register", { error: `Email already exist !` });
  }

  await userModel.create({
    userName: userName,
    email: email,
    password: password,
  });
  return res.render("login", {
    success: `Account created successfully, kindly login !`,
  });
};
const postLogin = async (req, res) => {
  const { email, password } = req.body;

  const checkF = ["email", "password"];
  const emptyAuth = [];
  for (const auth of checkF) {
    if (!req.body[auth] || req.body[auth] === "") {
      emptyAuth.push(auth);
    }
  }
  if (emptyAuth.length > 0) {
    return res.render("login", {
      error: `This field(s) ${emptyAuth.join(", ")} cannot be empty`,
    });
  }

  const checkUser = await userModel.findOne({ email: email });
  if (!checkUser) {
    return res.render("login", { error: `Email already exist !` });
  }
  const comparePassword = await bcrypt.compare(password, checkUser.password);
  if (comparePassword) {
    const token = await jwt.sign({ id: checkUser._id }, process.env.JWTKEY, {
      expiresIn: "1h",
    });
    res.cookie("nexusPlus", token);
    return res.redirect("/");
  } else {
    return res.render("login", { error: "Email or Password mismatch" });
  }
};

const logout = (req, res) => {
  if (req.user) {
    res.clearCookie("nexusPlus");
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }
};

const postAds = async (req, res) => {
  const {
    title,
    price,
    message,
    firstName,
    address,
    country,
    category,
    condition,
    brand,
  } = req.body;
  const images = req.files.images;
  const imageArr = [];
  const productField = [
    "title",
    "price",
    "message",
    "firstName",
    "address",
    "category",
    "country",
    "condition",
    "brand",
  ];
  const emptyField = [];
  for (const field of productField) {
    if (!req.body[field] || req.body[field] === "") {
      emptyField.push(field);
    }
  }
  if (emptyField.length > 0) {
    return res.render("post-ads", {
      error: `This field(s) ${emptyField.join(", ")} cannot be empty`,
    });
  }
  if (Array.isArray(images)) {
    await Promise.all(
      images.map(async (item) => {
        const newName = spName(item.name);
        const filePath = `/upload/${newName}`;
        imageArr.push(filePath);
        const fileDir = `public/upload/${newName}`;
        await item.mv(fileDir);
      })
    );
  } else {
    const newName = spName(images.name);
    const filePath = `/upload/${newName}`;
    imageArr.push(filePath);
    const fileDir = `public/upload/${newName}`;
    await images.mv(fileDir);
  }

  await productModel.create({
    title: title,
    price: price,
    message: message,
    firstName: firstName,
    address: address,
    country: country,
    category: category,
    condition: condition,
    brand: brand,
    images: imageArr,
  });
  res.render("post-ads", { success: "Product posted successfully" });
};

const getDetail = async (req, res) => {
  const userid = req.params.id;
  const allDetail = await productModel.findOne({ _id: userid });
  res.render("ads-details", { allDetail });
};

const getAdlistingGrid = async (req, res) => {
  const product = await productModel.find().sort({ date: -1 });
  const allProduct = await product.map((item) => {
    return {
      ...item.toObject(),
      showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
    };
  });
  res.render("adlistinggrid", { allProduct });
};

const getAdlistingList = async (req, res) => {
  const product = await productModel.find();
  const allProduct = await product.map((item) => {
    return {
      ...item.toObject(),
      showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
    };
  });
  res.render("adlistinglist", { allProduct });
};

const getCategory = async (req, res) => {
  const product = await productModel.find();
  const allProduct = await product.map((item) => {
    return {
      ...item.toObject(),
      showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
    };
  });
  res.render("category", { allProduct });
};

const postContact = async (req, res) => {
  const { Name, email, subject, message } = req.body;
  const field = [];
  const incomingField = ["Name", "email", "subject", "message"];
  for (const child of incomingField) {
    if (!req.body[child] || req.body[child] === "") {
      field.push(child);
    }
  }
  if (field.length > 0) {
    return res.render("contact", {
      error: `This field(s) ${field.join(", ")} cannot be empty`,
    });
  }
  await contactModel.create({
    Name: Name,
    email: email,
    subject: subject,
    message: message,
  });
  return res.render("contact", {
    success: "Posted successfully, You will get feedback soon",
  });
};

// Get code>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getLogin = (req, res) => {
  res.render("login");
};
const getRegister = (req, res) => {
  res.render("register");
};
const getAds = async (req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("post-ads", { currentUser });
    } else {
      res.render("post-ads");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getService = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("services", { currentUser });
    } else {
      res.render("services");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }

};
const getAbout = async(req, res) => { try {
  if (req.user) {
    const userId = req.body.id;
    const currentUser = await userModel.findOne({ _id: userId });
    res.render("about", { currentUser });
  } else {
    res.render("about");
  }
} catch (error) {
  console.log(error.message);
  res.render("error", { error: error.message });
}
};
const getAccountFavourite = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("account-favourite-ads", { currentUser });
    } else {
      res.render("account-favourite-ads");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getAccountMy = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("account-myads", { currentUser });
    } else {
      res.render("account-myads");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getAccountProfile = async(req, res) => {
   try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("account-profile-setting", { currentUser });
    } else {
      res.render("account-profile-setting");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getBlogGrid = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("blog-grid-full-width", { currentUser });
    } else {
      res.render("blog-grid-full-width");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getBlogLeft = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("blog-left-sidebar", { currentUser });
    } else {
      res.render("blog-left-sidebar");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getBlog = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("blog", { currentUser });
    } else {
      res.render("blog");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getContact = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("contact", { currentUser });
    } else {
      res.render("contact");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getDashboard = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("dashboard", { currentUser });
    } else {
      res.render("dashboard");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getFaq = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("faq", { currentUser });
    } else {
      res.render("faq");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getForgetPassword = async(req, res) => {
  res.render("forgot-password");
};
const getOfferMessage = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("offermessage", { currentUser });
    } else {
      res.render("offermessage");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getPayment = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("payments", { currentUser });
    } else {
      res.render("payments");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getPricing = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("pricing", { currentUser });
    } else {
      res.render("pricing");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getPrivacy = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("privacy-setting", { currentUser });
    } else {
      res.render("privacy-setting");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getSinglePost = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("single-post", { currentUser });
    } else {
      res.render("single-post");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getTestimonial = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("testimonial", { currentUser });
    } else {
      res.render("testimonial");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};
const getIndex2 = async(req, res) => {
  
      const product = await productModel.find()
      const allProduct = await product.map((item) => {
        return {
          ...item.toObject(),
          showPhoto: item.images[0] || "assets/img/featured/img-2.jpg",
        };
      });
      res.render("index-2", {allProduct});
};
const getIndex3 = async(req, res) => {
  try {
    if (req.user) {
      const userId = req.body.id;
      const currentUser = await userModel.findOne({ _id: userId });
      res.render("index-3", { currentUser });
    } else {
      res.render("index-3");
    }
  } catch (error) {
    console.log(error.message);
    res.render("error", { error: error.message });
  }
};

module.exports = {
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
  getPrivacy,
  getSinglePost,
  getTestimonial,
  getIndex2,
  getIndex3,
  postContact,
  logout
};
