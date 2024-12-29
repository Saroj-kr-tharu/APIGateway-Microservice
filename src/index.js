const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { default: rateLimit } = require("express-rate-limit");
const cors = require("cors");

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 500,
});

app.use(morgan("combined"));
app.use(limiter);
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     methods: ["POST", "DELETE", "GET"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    credentials: true,
  })
);

// const midle_proxy = createProxyMiddleware({
//   target: "http://localhost:3003/api/v1/",
//   changeOrigin: true,
// });

const midle_proxy = createProxyMiddleware({
  target: "http://localhost:3003/api/v1/",
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
    proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
  },
});

// const auth_proxy = createProxyMiddleware({
//   target: "http://localhost:3003/",
//   changeOrigin: true,
// });

// app.use("/auth", auth_proxy);

app.use("/authservice", midle_proxy);

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});
