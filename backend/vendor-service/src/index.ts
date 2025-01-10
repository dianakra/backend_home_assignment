import app from "./app";

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Vendor Service is running!"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Vendor Service listening on port ${PORT}`);
});
