import ServiceProducts from '../services/products.service.js';
import ServiceChats from '../services/chats.service.js';

const serviceChats = new ServiceChats();
const serviceProducts = new ServiceProducts();

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client websocket: ', socket.id);
    //SOCKET PRODUCTS
    socket.on('product_front_to_back', async (newProduct) => {
      try {
        await serviceProducts.createProduct(newProduct);
        const productList = await serviceProducts.getAllProducts();
        io.emit('products_back_to_front', { productList });
      } catch (error) {
        console.log(error);
      }
    });
    //SOCKET DELETE ELEMENTS
    socket.on('deleteProduct_front_to_back', async (id) => {
      try {
        await serviceProducts.deleteProduct(id);
        socket.emit('productDeleted_back_to_front', { message: 'Product successfully removed' });
        const productList = await serviceProducts.getAllProducts();
        io.emit('products_back_to_front', { productList });
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        socket.emit('productDeleteError_back_to_front', { error: 'An error occurred while deleting the product' });
      }
    });
    //SOCKET CHAT
    socket.on('chat_front_to_back', async (message) => {
      try {
        serviceChats.createChat(message);
        const messages = await serviceChats.getChat();
        console.log(messages);
        socket.emit('chat_back_to_front', messages);
        socket.broadcast.emit('chat_back_to_front', messages);
      } catch (error) {
        console.log(error);
      }
    });

    //SOCKET DESCONEXION
    socket.on('disconnect', () => {
      console.log('User was disconnected');
    });
  });
};
