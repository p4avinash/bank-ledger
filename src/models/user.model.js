const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: [true, "Email already exists"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please create a password"],
      minLength: [6, "Password should be more than 6 characters"],
      select: false, // Don't fetch password while fetching user unless asked to fetch specifically
    },
  },
  {
    timestamps: true,
  },
)

// If password is changed, hash it before saving to db
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  return
})

// Creating a compare password method in schema for further use
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel
