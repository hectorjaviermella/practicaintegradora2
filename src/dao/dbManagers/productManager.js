import { productModel } from "../models/product.model.js";

export default class ProductManager {
  constructor() {}

//////////////////////////////////////////////////////////////////////////////////
  getProducts = async (query,limit,page,pCategory,pStatus,sort) => {
    try {
      let products=0;
      
      products = await productModel.paginate(query, {limit:limit,page:page,pCategory,pStatus,lean:true,sort:sort});   
      
                
      return products;
    } catch (error) {
      console.log(error);
    }
  };
/////////////////////////////////////////////////////////////////////////////////////
  getProductsById = async (pId) => {
    try {
      const products = await productModel.findById({ _id: pId ,lean:true}).lean();
      return products;
    } catch (error) {
      console.log(error);
    }
  };
///////////////////////////////////////////////////////////////////////////////////
  addProduct = async (product) => {
    try {
      const createdProduct = await productModel.create(product);
      return createdProduct;
    } catch (error) {
      console.log(error);
    }
  };

////////////////////////////////////////////////////////////////////////////////////////
  deleteProduct = async (pId) => {
    try {
        let result = await  productModel.deleteOne({ _id: pId });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
////////////////////////////////////////////////////////////////////////////////////
  updateProducto = async (pId,productonuevo) => {
    try {
      const createdProduct = await productModel.updateOne({ _id: pId }, productonuevo);
      return createdProduct;
    } catch (error) {
      console.log(error);
    }
  };
}