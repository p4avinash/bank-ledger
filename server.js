const app = require("./src/app")
const connectDb = require("./src/db/db")

const PORT = process.env.PORT

connectDb()

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})
