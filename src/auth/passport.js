import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import config from "../config.js";

const { clientID, clientSecret, callbackUrl } = config;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
 /////////////////////////////////////////////////////////////////////

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
            
          const { first_name, last_name, email, age,role } = req.body;
          
       
          let user = await userModel.findOne({ email: username }).lean();
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }


          const cart = await cartModel.create({});

          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            role: role ?? "user",
            cart: cart._id,
          };

          let result = await userModel.create(newUser);

          return done(null, result); //devuelvo resultado
        } catch (error) {
          return done("Error when trying to find user:" + error);
        }
      }
    )
  );

  
//////////////////////////////////////////////////////////////////////////////////////////////////
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username }).lean();
          if (!user) return done(null, false);

          if (!isValidPassword(user, password)) 
              return done(null, false); //contrasena incorrecta

              //
          delete user.password;

          if (user.email ==="adminCoder@coder.com")
               user.role="admin";
          else
               user.role="user";

           console.log("datos del usuario xxxxxxxx");
           console.log("local stra" + user);

          return done(null, user);  //retorno el usuario
        } catch (error) {
          return done(error);
        }
      }
    )
  );

/////////////////////////////////////////////////////////////////////////////////////////////////
passport.use(
  "githublogin",
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ email: profile._json.email });
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 20,
            email: profile._json.email,
            password: "",
          };

          let result = await userModel.create(newUser);
          return done(null, result);
        }
        console.log("github" + user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

///////////////////////////////////////////////////////////////////////////////////////////////
passport.serializeUser((user, done) => {
  done(null, user._id);
});
////////////////////////////////////////////////////////////////////////////////////////////////
passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});
};












export default initializePassport;