const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");

async function add(user) {
  user.password = await bcrypt.hash(user.password, 14);
  const [id] = await db("users").insert(user);
  return findById(id);
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}
function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}

module.exports = {
  add,
  findById,
  findBy
};