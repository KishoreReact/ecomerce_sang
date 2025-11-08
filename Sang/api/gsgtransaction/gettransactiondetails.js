export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { id, docType } = req.query;

  console.log("Mock gettransactiondetails params:", req.query);

  // ✅ Mock response for Order Details (docType = 1, id = 13207)
  if (docType === "1" && id === "13207") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Order Details retrieved",
      result:
        "{\"Header\":[{\"TransId\":13207,\"DocNo\":\"ORD204\",\"Date\":\"2025-10-20T00:00:00\",\"Country\":1,\"Country_Name\":\"UAE\",\"Customer\":225,\"Customer_Name\":\"ARDH AL HAYAWANAT ACCESSORIES AND SUPPLIES ANIMALS AND BIRD\",\"DeliveryAddress\":\"FLOOR G1, , SHARJAH, \",\"EventName\":\"chk\",\"Remarks\":\"\",\"Email\":\"MUHAMMET.MAYA06@GMAIL.COM\",\"MobileNo\":\"\",\"status\":\"Processing\",\"DiscountType\":0,\"DiscountType_Name\":\"\",\"PayTerms\":1,\"PayTerms_Name\":\"Cash On Delivery\",\"PayTerms_Name1\":\"30\",\"DiscountCouponRef\":null,\"DiscountRef\":null,\"SampleRequestBy\":0,\"SampleRequestBy_Name\":null,\"DeliveryTerms\":null,\"DeliveryDate\":null}],\"Body\":[{\"Product\":27531,\"Product_Name\":\"KIDNEY PROFILE PLUS BOX OF 12 ROTORS\",\"ProductCode\":\"10023234\",\"Quantity\":1.00000,\"Rate\":100.00000,\"Unit\":1,\"Unit_Name\":\"PCS\",\"Vat\":5.00000,\"Addcharges\":0.00000,\"Discount\":0.00000,\"DiscountAmt\":0.00000,\"DiscountRemarks\":\"\",\"Remarks\":\"\"},{\"Product\":27438,\"Product_Name\":\"DISPOSABLE MINIPETTE TIPS RACK OF 96\",\"ProductCode\":\"45022049\",\"Quantity\":1.00000,\"Rate\":100.00000,\"Unit\":1,\"Unit_Name\":\"PCS\",\"Vat\":5.00000,\"Addcharges\":0.00000,\"Discount\":0.00000,\"DiscountAmt\":0.00000,\"DiscountRemarks\":\"\",\"Remarks\":\"\"},{\"Product\":27524,\"Product_Name\":\"COMPREHENSIVE DIAGNOSTIC PROFILE BOX OF 24 ROTORS\",\"ProductCode\":\"10023220\",\"Quantity\":4.00000,\"Rate\":100.00000,\"Unit\":4,\"Unit_Name\":\"BOX-26\",\"Vat\":5.00000,\"Addcharges\":0.00000,\"Discount\":0.00000,\"DiscountAmt\":0.00000,\"DiscountRemarks\":\"\",\"Remarks\":\"\"},{\"Product\":27523,\"Product_Name\":\"COMPREHENSIVE DIAGNOSTIC PROFILE BOX OF 12 ROTORS\",\"ProductCode\":\"10023219\",\"Quantity\":3.00000,\"Rate\":100.00000,\"Unit\":1,\"Unit_Name\":\"PCS\",\"Vat\":5.00000,\"Addcharges\":0.00000,\"Discount\":0.00000,\"DiscountAmt\":0.00000,\"DiscountRemarks\":\"\",\"Remarks\":\"\"},{\"Product\":27532,\"Product_Name\":\"ELECTROLYTE PLUS – VS2 ONLY BOX OF 12\",\"ProductCode\":\"10023236\",\"Quantity\":1.00000,\"Rate\":100.00000,\"Unit\":1,\"Unit_Name\":\"PCS\",\"Vat\":5.00000,\"Addcharges\":0.00000,\"Discount\":0.00000,\"DiscountAmt\":0.00000,\"DiscountRemarks\":\"\",\"Remarks\":\"\"}]}"
    });
  }

  // ✅ Default response for unknown order
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "Order not found.",
    result: "{\"Header\":[],\"Body\":[]}",
  });
}
