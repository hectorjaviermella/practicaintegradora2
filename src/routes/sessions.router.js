import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

console.log("entrando al session router");
////////////////////////////////////////////////////////////////
router.get("/logout",  (req, res) => {
  console.log("logouts");
  req.session.destroy( err => {
    if (!err) {
             return res.send("Logout exitoso");
             //return res.redirect("/login");
    }
    else
         res.send("Logout no exitoso");
  })
});

////////////////////////////////////////////////////////////////////////////
router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    return res.send({ status: "sucess", message: "user registered" });
  }
);


//////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/login",
  passport.authenticate("login"),
  async (req, res) => {
    if (!req.user)
      return res.status(401).send({ status: "error", error: "Unauthorized" });
      
      
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,

    };
    
    res.send({ status: "sucess", payload: req.user });
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////
router.put("/restore", async (req, res) => {
  try {
    console.log("entro al restore sssion");

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "user does not exist" });
    }

    const hashedPassword = createHash(password);

    await userModel.updateOne({ email }, { password: hashedPassword });

    return res.send({
      status: "sucess",
      message: "succesfully updated password",
    });
  } catch (error) {
    console.log(error);
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.get(
  "/github",
  passport.authenticate("githublogin", { scope: ["user:email"] }),
  async (req, res) => {}
);
//////////////////////////////////////////////////////////////////////////////////////////////////////
router.get(
  "/githubcallback",
  passport.authenticate("githublogin", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    console.log(req.user);
    res.redirect("/products");
  }
);


////////////////////////////////////////////////////////////////
/*router.get("/current",  (req, res) => {
  console.log("current");
  return res.send({ status: "sucess", payload: req.session.user  });
});
*/

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export default router;