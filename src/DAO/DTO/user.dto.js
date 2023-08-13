class userDTO {
    constructor(user) {
      this.name = user.firstName;
      this.lastname = user.lastName;
      this.email = user.email;
      this.role = user.role;
      this.age = user.age;
      this.cartID = user.cartID;
    }
  }

export default userDTO;
