class User {
  setId(id) {
    this.id = id;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setPassword(password) {
    this.password = password;
    return this;
  }

  setAge(age) {
    this.age = age;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      age: this.age,
    };
  }
}

export default User;