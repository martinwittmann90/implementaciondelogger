import ProductsDAO from "../DAO/classes/product.dao.js";
const productsDAO = new ProductsDAO();
import ProductModel from "../DAO/models/product.model.js";
import EErros  from "../error/enum.js";
import CustomError  from "../error/customError.js";
import {customErrorMsg} from "../error/customErrorMessage.js";

class ServiceProducts {
    async getAllProducts(page, limit, sort, query) {
        try {
            const filter = query
            ? { title: { $regex: query.title, $options: "i" } }
            : {};
            const options = {
            limit: limit || 5,
            page: page || 1,
            sort: sort === "desc" ? "-price" : "price",
            lean: true,
            };
            const products = await productsDAO.getAllProductsDao(filter, options);
            return products;
        } catch (err) {
            throw err;
        }
        }
    async getProductById(id) {
        try {
            const product = await productsDAO.getProductById( { _id: id } );
            return product;
        } catch (err) {
            throw (`No se encontró producto de id ${id}.`);
        }
    };
    async createProduct(productData) {
        try {
            const { title, description, price, thumbnail, code, stock, category } = productData;
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                return CustomError.createError({
                    name: 'Validation Error',
                    message: 'Wrong format.',
                    code: EErros.INVALID_TYPES_ERROR,
                    cause: customErrorMsg.generateProductErrorInfo(productData),
                    });
                }
            if (await productsDAO.getProductById(code, true)) {
                return CustomError.createError({
                    name: 'Validation Error',
                    message: 'Product alredy exists.',
                    code: EErros.PRODUCT_ALREADY_EXISTS,
                    cause: customErrorMsg.generateProductoErrorAlredyExists(productData),
                    });
                }
            const newProd = await productsDAO.createOneProduct(productData);
            return newProd;
        } catch (error) {
            throw CustomError.createError({
                name: 'When creating product',
                message: "err",
                code: EErros.ADD_PRODUCT_ERR
            });
        }
    }

    async updateProduct(productId, productData) {
        try {
            const productUpdate = await productsDAO.updateOneProduct(
                productId,
                productData,
                { new: true }
            );
            return productUpdate;
        } catch (error) {
            throw (`Could not modify product. ${err}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const delProd = await productsDAO.deleteOneProduct(productId);
            return delProd;
        } catch (error) {
            throw (`Failed to find product with id number: ${productId}`);
        }
    }
};

export default ServiceProducts;