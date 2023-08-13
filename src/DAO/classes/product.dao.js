import ProductModel from "../models/product.model.js"

class ProductsDAO {
  async getAllProductsDao(filter, options) {
    try {
      const products = await ProductModel.paginate(filter, options);
      return products;
    } catch (err) {
      throw err;
    }
  }
  async getProductById(id) {
    try {
      const product = await ProductModel.find({ _id: id });
      return product;
    } catch (err) {
        throw (`No se encontró el producto.`);            
    }
};
  async createOneProduct(){
    const product = ProductModel.create();
    return product;
  };
  async deleteOneProduct(){
    const product = ProductModel.deleteOne();
    return product;
  };
  async updateOneProduct(){
    const product = ProductModel.findByIdAndUpdate();
    return product;
  };
  async getProduct(productId){
    const product = ProductModel.findById(productId);
    return product;
  }
  
};
export default ProductsDAO;

