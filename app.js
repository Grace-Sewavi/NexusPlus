const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
require("dotenv").config();
const userRoutes = require("./route/userRoutes");
const adminRoutes = require("./route/adminRoute")
const mongoose = require("mongoose");
const cookies = require("cookie-parser")
const fileUpload = require("express-fileupload")

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Database connection established")
}).catch((err)=>{
    console.log(err.message)
})

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayouts: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "hbs");


app.use(cookies())
app.use(fileUpload())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", userRoutes);
app.use('/', adminRoutes)

app.get("*", (req, res) => {
  res.render("404");
});


const port = process.env.PORT;
app.listen(port, () => {
  console.log("listening on port " + port);
});
