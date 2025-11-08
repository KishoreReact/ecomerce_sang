export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { docType, pageNumber, pageSize } = req.query;

  console.log("Mock gettransactionsummary params:", req.query);

  // ✅ 1. ORDER LIST → docType = 1
  if (docType === "1") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Order Summary retrieved.",
      result:
        "{\"Data\":[{\"TransId\":13214,\"Docno\":\"ORD211\",\"Date\":\"2025-10-24T00:00:00\",\"Status\":\"Processing\",\"Total\":246750.0,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":5.0},{\"TransId\":13211,\"Docno\":\"ORD208\",\"Date\":\"2025-10-22T00:00:00\",\"Status\":\"Processing\",\"Total\":3405.675,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":12.0},{\"TransId\":13207,\"Docno\":\"ORD204\",\"Date\":\"2025-10-20T00:00:00\",\"Status\":\"Processing\",\"Total\":1050.0,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":10.0},{\"TransId\":13206,\"Docno\":\"ORD203\",\"Date\":\"2025-10-20T00:00:00\",\"Status\":\"Processing\",\"Total\":1365.0,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":13.0},{\"TransId\":13181,\"Docno\":\"ORD188\",\"Date\":\"2025-10-11T00:00:00\",\"Status\":\"Processing\",\"Total\":640.269,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":10.0},{\"TransId\":13180,\"Docno\":\"ORD187\",\"Date\":\"2025-10-11T00:00:00\",\"Status\":\"Processing\",\"Total\":648.8055,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":11.0},{\"TransId\":13170,\"Docno\":\"ORD177\",\"Date\":\"2025-10-10T00:00:00\",\"Status\":\"Processing\",\"Total\":619.017,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":7.0},{\"TransId\":13169,\"Docno\":\"ORD176\",\"Date\":\"2025-10-10T00:00:00\",\"Status\":\"Processing\",\"Total\":755.2965,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":9.0},{\"TransId\":11161,\"Docno\":\"ORD165\",\"Date\":\"2025-10-09T00:00:00\",\"Status\":\"Processing\",\"Total\":522.5535,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":7.0},{\"TransId\":11154,\"Docno\":\"ORD158\",\"Date\":\"2025-10-08T00:00:00\",\"Status\":\"Processing\",\"Total\":579.4425,\"Country\":\"UAE\",\"CreatedBy\":\"TestAPI\",\"Qty\":11.0}],\"PageSummary\":[{\"TotalRows\":154,\"TotalPages\":16}]}"
    });
  }

  // ✅ 2. WISHLIST → docType = 2
  if (docType === "2") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "WishList Summary retrieved.",
      result:
        "{\"Data\":[{\"TransId\":6057,\"Id\":25965,\"Name\":\"\\\"ELECTRO-EJACULATOR, INCLUDES: CARRY CASE, POWER SUPPLY AMD\",\"Code\":\"11900/0000\",\"Description\":\"\",\"ExtraDescription\":\"CONNECTING CABLES FOR EXTERNAL\",\"Image\":\"http://103.120.178.195/GSGImage/11900_0000.jpg\",\"Stock\":0.0,\"Rate\":16038.0,\"CategoryName\":\"NON-FOOD\",\"SubCategoryName\":\"CONSUMABLES\",\"Quantity\":1.0,\"Remarks\":\"\",\"CreatedBy\":\"TestAPI\"}],\"PageSummary\":[{\"TotalRows\":1,\"TotalPages\":1}]}"
    });
  }

  // ✅ 3. CART LIST → docType = 3
  if (docType === "3") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Cart Summary retrieved.",
      result:
        "{\"Data\":[{\"TransId\":11530,\"Product_Id\":13829,\"Product_Name\":\"PRO PLAN ADULT DELICATE DIGESTION, DRY CAT FOOD TURKEY,400G\",\"Customer_Name\":\"FOUR MED MEDICAL INSTRUMENTS TRADING L.L.C\",\"Warehouse_Name\":null,\"Quantity\":1.0,\"Rate\":20.0,\"Total\":21.0,\"StockQty\":6867.0,\"Remarks\":\"\",\"CreatedBy\":\"TestAPI\",\"Image\":\"http://103.120.178.195/GSGImage/12372502.png\"}],\"PageSummary\":[{\"TotalRows\":1,\"TotalPages\":1}]}"
    });
  }

  // ✅ Fallback for unknown docType
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "No records found for this docType.",
    result: "[]",
  });
}
