import { Router } from "express";
import CartManager from "../dao/dbManagers/cartManager.js";
import { uploader } from "../utils.js";


const router = Router();
const cartManager = new CartManager();
//////////////////////////////////////////////////////////////////////////////////////////////
router.get("/:cId", async (req, res) => {
    console.log("entro a buscar por reques.param cId");  
  const cId = req.params.cId;
  const carts = await cartManager.getCartsById(cId);
  
  if (!carts) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo encontrar el carrito" });
  }
  return res.send({ status: "success", payload: carts});
});

//////////////////////////////////////////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
    console.log("entro al post carts");
    const cart = req.body;
    let createdCart =  await cartManager.addCartVacio();    
  //const createdCart = await cartManager.createCart();
  if (!createdCart) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo crear el carrito" });
  }

  return res.send({ status: "success", payload: createdCart});
});

  
/////////////////////////////////////////////////////////////////////////////////////////////
router.post("/:cId/product/:pId",async (req, res) => {
  console.log("entro al post carts incremetar");
  let pquantity={"quantity":1};
  if (!req.body)
       pquantity = req.body;      
  const cId = req.params.cId;
  const pId = req.params.pId;
  let error =  await cartManager.addProductToCart(cId,pId,pquantity);    
  return res.send(error);

});
//////////////////////////////////////////////////////////////////////////////////////
//elimina todo los productos del carrito
router.delete("/:cId", async (req, res) => {
  try {
    const { cId } = req.params;

    let result = await cartManager.deleteCart(cId);
    if (!result) {
      return res
        .status(404).send({
        status: "error",
        error: "Could not delete cart. No cart found in the database",
      });
    }
    res.send({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
  }
});
  ////////////////////////////////////////////////////////////////////////////////////////////////
//elimina un producto del carrito especifico
router.delete("/:cId/product/:pId",async (req, res) => {
  try {
    console.log("elimina un producto del carrito especifico");    
    const cId = req.params.cId;
    const pId = req.params.pId;
    let result = await cartManager.deleteProductToCart(cId,pId);
    if (!result) {
      return res
        .status(404).send({
        status: "error",
        error: "Could not delete producto to cart. No cart found in the database",
      });
    }
    res.send({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
  }
});
  ////////////////////////////////////////////////////////////////////////////////////////////////
//actualizar la cantidad de unidades de un producto que se encuentra en el carrito
router.put("/:cId/product/:pId",async (req, res) => {
  try {
    console.log("actualizar la cantidad de unidades de un producto que se encuentra en el carrito");    
    const cId = req.params.cId;
    const pId = req.params.pId;
    const pquantity = req.body;
    
    let result = await cartManager.updateQuantitytoProductToCart(cId,pId,pquantity);
    if (!result) {
      return res
        .status(404).send({
        status: "error",
        error: "Could not update quantity to producto to cart. No cart found in the database",
      });
    }
    res.send({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
  }
});
 //////////////////////////////////////////////////////////////////////////////////////
//PUT actualiza el carrito con un arreglo de productos
router.put("/:cId", async (req, res) => {
  try {
    console.log("actualiza carrito con un arreglo de productos");
    const cId = req.params.cId;   
    var listproduc = new Array(); 

      
     if (req.body) 
          listproduc = req.body;   
      else {
          console.log("entro armar el arraysssssssssssss");
          listproduc = [{"quantity": 1, "pId": cId }];      

      }        

    let result = await cartManager.updatetoListProducToCart(cId,listproduc);
    if (!result) {
      return res
        .status(404).send({
        status: "error",
        error: "Could not delete cart. No cart found in the database",
      });
    }
    res.send({ status: "Success", payload: result });
  } catch (error) {
    console.log(error);
  }
});
  
export default router;