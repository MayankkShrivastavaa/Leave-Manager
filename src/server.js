const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");

require("dotenv").config();

const connectDB = require("./config/db");

const employeeRoute = require("./routes/employeeRoute");

const app = express();

// MiddleWare
app.use(express.json());

app.use("/employee", employeeRoute);

connectDB();

app.get("/", (req, res) => {
  res.status("Hello From Server");
});

let Port = process.env.PORT;

app.listen(Port, (err) =>
  err ? console.log(err) : console.log(`Server is Running at Port ${Port}`),
);
