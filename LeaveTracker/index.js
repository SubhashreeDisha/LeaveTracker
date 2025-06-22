const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectToDatabase = require("./config/db");
const authRouter = require("./routes/auth.route");
const employeeRoute = require("./routes/leave.route");
const adminRouter = require("./routes/admin.route");

const app = express();
const PORT = 5000;


connectToDatabase();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

app.use("/auth", authRouter);
app.use("/employee", employeeRoute);
app.use("/admin", adminRouter);


app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`)
})