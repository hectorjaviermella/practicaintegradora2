import { Router } from "express";
import { checkLogged, checkLogin } from "../middlewares/auth.js";
import ProductManager from "../dao/dbManagers/productManager.js";
import CartManager from "../dao/dbManagers/cartManager.js";

// 1 - crea instancia de la clase
let productManager = new ProductManager();
let cartManager = new CartManager();
const router = Router();



router.get("/login", checkLogged, (req, res) => {  
  res.render("login");
});

router.get("/register", checkLogged, (req, res) => {
  res.render("register");
});


router.get("/current", checkLogin, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/restore", (req, res) => {
  res.render("restore");
});



router.get("/", checkLogged, (req, res) => {
  res.render("login");
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//muestra todo los productos 
router.get("/products", async (req, res) => {
  console.log("entro view router a mostrar todo los productos");


   let {limit =2 , page =  1, pCategory, pStatus, sort} = req.query; 
   
  let query ={
    pCategory: pCategory || { $exists: true },
    pStatus: pStatus || { $exists: true },
  }; 
    
  if (sort===1)
  sort={ pPrice:-1};
else
  sort={ pPrice:-1};  

 const { docs: productos,  hasPrevPage,  hasNextPage,  nextPage,  prevPage,  totalPages,
} = await productManager.getProducts(query,limit,page,pCategory,pStatus,sort);  

return res.render("products", { user:req.session.user , productos,  page,  hasPrevPage,  hasNextPage,  prevPage,  nextPage,  totalPages,});
});

///////////////////////////////////////////////////////////////////////////////////
//muestra un producto
router.get("/product/:pId", async (req, res) => {
  const pId = req.params.pId;
  const cId = req.user.cart; 
  
    const prod = await productManager.getProductsById(pId);
  
  //res.render("product", prod);
  res.render("product", { prod, cId });
});


/////////////////////////////////////////////////////////////////////////////////////
router.get("/cart/:cId", async (req, res) => {
  const { cId } = req.params;
  console.log("view router cart",cId);  
    const cart = await cartManager.getCartsById(cId);
  res.render("cart", { cart: cart});
});

export default router;