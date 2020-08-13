module.exports = {
  match: (user1, user2) => {
    if(!user1.id || !user2.id) {
      return false;
    }

    return user1.id.toString() === user2.id.toString();
  }
}
