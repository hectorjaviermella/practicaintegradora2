import cartModel from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";




export default class CartManager {
  constructor() {}
  //////////////////////////////////////////////////////////////////////////////////
  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  };
//////////////////////////////////////////////////////////////////////////////////////
getCartsById = async (cId) => {
    try {
      console.log("muestra carrito por idxx");

      const cart = await cartModel.findOne({ _id: cId }).lean().populate("products.pId");
      
       return cart;
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  addCartVacio = async (cart) => {
    console.log("agregar carrito vacio");
    try {
      const createdCart = await cartModel.create(null);
      return createdCart;
    } catch (error) {
      console.log(error);
    }
  };
///////////////////////////////////////////////////////////////////////////////////////////////////
  createCart = async (cart) => {
    try {
      const createdCart = await cartModel.create(cart);
      return createdCart;
    } catch (error) {
      console.log(error);
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////
  addProductToCart = async (cId,pId,pquantity) => {
    try {
      console.log("addProdutTocart"); 
      console.log("valores ", cId,pId, pquantity)
      let result;
      //recupero el carrito
      const cart = await cartModel.findById({ _id: cId });
      console.log("cart xx ", cart)
      if (cart=== undefined){
        return  "No existe el carrito";
     };
           let productstocart = cart.products;                      
     
        
              let indexproduct = productstocart.findIndex((product) => product.pId.toString() === pId.toString());  
              if (indexproduct === -1){ //no encontro el producto                 
                const productagregar = {"pId" : Object(pId) , "quantity" : Number(pquantity.quantity)};
                productstocart.push(productagregar);
                cart.products=productstocart; 
                const cartsactualizado = await this.updateCart(cId,cart);        
                return result ="the cart was updated correctly." //cartsactualizado      

                }else{ //encontro el  producto en mi carrito
                    //preparar objeto a modificar                  
                    productstocart[indexproduct].quantity=productstocart[indexproduct].quantity +  Number(pquantity.quantity);
                  cart.products=productstocart;           
                  const cartsactualizado = await this.updateCart(cId,cart);             
                    return result ="the cart was updated correctly" //cartsactualizado
                } 
     
    } catch (error) {
      console.log(error);
    }
  };

   ///////////////////////////////////////////////////////////////////////////////////////////////////
   updateCart = async (cId,cartnuevo) => {
    try {
      const createdCart = await cartModel.updateOne({ _id: cId }, cartnuevo);
      return createdCart;
    } catch (error) {
      console.log(error);
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////
  deleteCart = async (cId) => {
    try {
         let tempcarrito = await  cartModel.findOne({ _id: cId });
         let result;
         if (tempcarrito)
              result = await  cartModel.deleteOne({ _id: cId });
         else result="no exist to cart"
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  
  deleteProductToCart = async (cId,pId) => {
    try {
      //console.log("elimina un producto del carrito manager"); 
        let result="";
        let tempcarrito = await  cartModel.findOne({ _id: cId });
        if (tempcarrito)
             {
              let productstocart = tempcarrito.products;     
              let indiceProducto = await productstocart.findIndex((product) => product.pId == pId);                
              if (indiceProducto>=0)
                   {//encontrado el producto                   
                    result= await cartModel.updateOne({ _id: cId },  {$pull: {products: {pId: pId}}});
                    return result;
                   }else{
                    //no encontrado producto
                    return result("No exist product");                                    
                   }
             }else{
               //no existe el carrito
               return result="No exist cart";
             }
        
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  updateQuantitytoProductToCart = async (cId,pId,pquantity) => {
    try {
      console.log("actualizar la cantidad de unidades de produto to cart"); 
        let result="";
        let tempcarrito = await  cartModel.findOne({ _id: cId });
        if (tempcarrito)
             {
              let productstocart = tempcarrito.products;     
              let indiceProducto = await productstocart.findIndex((product) => product.pId == pId);           
                  
              if (indiceProducto>=0)
                   {//encontrado el producto                   
                   result= await cartModel.updateOne(
                    {  _id: cId  },
                    { $set: { "products.$[prod].quantity": pquantity.quantity } },
                    { arrayFilters: [ { "prod.pId": pId} ] });
                  
                    return result;
                   }else{
                    //no encontrado producto
                    return result="No exist product to cart";
                                    
                   }
             }else{
               //no existe el carrito
               return result="No exist cart";
             }
        
      return result;
    } catch (error) {
      console.log(error);
    }
  };
   ///////////////////////////////////////////////////////////////////////////////////////////////////  
   updatetoListProducToCart = async (cId,listproduc) => {
    try {
      console.log("acutaliza el cart con una lista de productos manager"); 
        let result="";
        console.log("liscarrito",listproduc);
        let cart = await cartModel.findOne({ _id: cId });
        if (cart)
             {
              console.log("encontro el cart xx " , cart);
              //recorro cada elemento de la lista a agregar
              for (let i = 0; i < listproduc.length ; i++) {
                        //lista de elementos del carrito
                          let productstocart = cart.products;  
                          let productemp =listproduc[i];                         
                          let pId=productemp.pId;                            
                    
                          let indiceProducto = await productstocart.findIndex((product) => product.pId.toString() === pId.toString());                          
                          
                          if(indiceProducto <0){//insertarlo 
                              //console.log("elemento no encontrado",productemp.pId);  
                              let newquantity = productemp.quantity;                          
                              const updateResponse = await fetch(`http://localhost:8080/api/carts/${cId}/product/${productemp.pId}`,{
                              method:'POST',
                              headers: { 'Content-Type': 'application/json'},
                              body: JSON.stringify({quantity:newquantity})
                            });       
                          }else{ //actualizar la cantidad
                            //console.log("elemento  encontrado",productemp.pId);
                            let newquantity = cart.products[indiceProducto].quantity +1;
                            const updateResponse = await fetch(`http://localhost:8080/api/carts/${cId}/product/${productemp.pId}`,{
                              method:'PUT',
                              headers: { 'Content-Type': 'application/json'},
                              body: JSON.stringify({quantity:newquantity})
                            });         
                         
                          }               
                 }  //ford         
                 return result="Product modificado";
             }else{
               //no existe el carrito
               return result="No exist cart";
             }
        
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  
}