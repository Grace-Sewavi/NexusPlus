const adminModel = require("../model/adminModel");

const getRegisterAdmin = (req, res) => {
  res.render("register-admin");
};
const getAdminLogin = (req, res)=>{
    re.render("admin-login")
}

const postRegisterAdmin = async (req, res) => {
  try {
    const { name, password, retypePassword, email } = req.body;
    const incomingArr = ["name", "password", "email", "retypePassword"];
    const emptyArr = [];
    for (const child of incomingArr) {
      if (!req.body[child] || req.body === "") {
        emptyArr.push(child);
      }
    }
    if (emptyArr.length > 0) {
      return res.render("register-admin", {
        error: `This field(s) ${emptyArr.join(", ")} cannot be empty`,
      });
    }

    const checkEmail = await adminModel.findOne({ email: email });
    if (checkEmail) {
      return res.render("register-admin", {
        error: "Opps!! Email already existed",
      });
    }
    if (password !== retypePassword) {
      return res.render("register-admin", { error: "Password mismatch" });
    }
    await adminModel.create({
      name: name,
      email: email,
      password: password,
    });
    return res.render("admin-login", {
      success: "Account Created successfully, Please kindly login",
    });
  } catch (error) {
    console.log(error.message);
    return res.render(error.message);
  }
};
module.exports = { getRegisterAdmin,getAdminLogin,
    postRegisterAdmin };
