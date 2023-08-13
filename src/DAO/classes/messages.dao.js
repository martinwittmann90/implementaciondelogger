import MessageModel from "../models/message.model.js"
class MessagesDAO {
  async getAll() {
    try {
      const menssages = await MessageModel.find({});
      return menssages;
    } catch (error) {
      console.log(error);
    }
  }

  async add(message) {
    try {
      const newMessage = await MessageModel.create(message);
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  }
}

export default MessagesDAO;

