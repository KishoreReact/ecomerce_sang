export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { customerId } = req.query;

  console.log("Mock getcustomeraddress params:", req.query);

  // ✅ Mock response for customerId = 1027
  if (customerId === "1027") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Customer Address Retrieved",
      result:
        "[{\"Id\":225,\"Name\":\"ARDH AL HAYAWANAT ACCESSORIES AND SUPPLIES ANIMALS AND BIRD\",\"BillingAddress\":\"FLOOR G1\",\"BillingCity\":\"SHARJAH\",\"BillPin\":\"0\",\"BillTelNo\":\"+971559664228\",\"Email\":\"MUHAMMET.MAYA06@GMAIL.COM\",\"DeliveryAddress\":\"\",\"DeliveryPin\":\"0\",\"DeliveryCity\":\"\"}]"
    });
  }

  // ✅ Default empty response for unknown customer
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "No address found for this customer.",
    result: "[]",
  });
}
