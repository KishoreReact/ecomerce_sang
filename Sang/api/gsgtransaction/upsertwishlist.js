export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const payload = req.body;

  console.log("Mock upsertwishlist payload:", payload);

  // ✅ Always return success (mock behavior)
  return res.status(200).json({
    status: "Success",
    statusCode: 2001,
    message: "Inserted successfully",
    result: "8111"
  });
}
