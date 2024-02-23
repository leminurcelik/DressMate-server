/* User Model:
    * Attributes:
    * userId: Unique identifier for each user.
    * Email: User's chosen username.
    * Name
    * Surname
    * Gender 
    * password: Encrypted user password.
    * wardrobe: Array of clothing items associated with the user
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        },
    surname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
//works just before the data added to the db
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    //new or updated password
    try {
      const hash = await bcrypt.hash(user.password, 12);
      user.password = hash;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;