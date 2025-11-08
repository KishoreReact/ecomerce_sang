export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { category } = req.query;

  console.log("Mock getbrandsbycategory params:", req.query);

  // ✅ Mock response for category = 103
  if (category === "103") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Record(s) successfully retrieved.",
      result:
        "[{\"BrandId\":3,\"BrandName\":\"NESTLE\",\"BrandCode\":\"NESTLE\"}]"
    });
  }

  // ✅ Default fallback: no brands found
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "No records found.",
    result: "[]",
  });
}
