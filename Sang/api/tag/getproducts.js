export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  // Read all query params sent by frontend
  const {
    refreshFlag,
    pageSize,
    pageNumber,
    category,
    subCategory,
    itemBrand,
    minPrice,
    maxPrice,
    sortColumn,
    isAscending,
    inStock,
    search
  } = req.query;

  console.log("Mock getproducts params:", req.query);

  // ✅ This mock always returns your same known dataset
  return res.status(200).json({
    status: "Success",
    statusCode: 2000,
    message: "Products retrieved.",
    result:
      "{\"Data\":[{\"Id\":13815,\"Name\":\"PRO PLAN DELICATE WET CAT FOOD, OCEANFISH IN GRAVY,10X85G\",\"Code\":\"12458129\",\"Image\":\"http://103.120.178.195/GSGImage/8aae68f1-fe25-4aff-b98b-6f5a193eb76b.jpeg\",\"Stock\":7278.0,\"Rate\":45.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"WET\",\"Image_url\":\"http://103.120.178.195/GSGImage/8aae68f1-fe25-4aff-b98b-6f5a193eb76b.jpeg\"},{\"Id\":13829,\"Name\":\"PRO PLAN ADULT DELICATE DIGESTION, DRY CAT FOOD TURKEY,400G\",\"Code\":\"12372502\",\"Image\":\"http://103.120.178.195/GSGImage/12372502.png\",\"Stock\":6867.0,\"Rate\":20.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12372502.png\"},{\"Id\":13816,\"Name\":\"PRO PLAN KITTEN, WET CAT FOOD, TURKEY IN GRAVY, 10X85G\",\"Code\":\"12457983\",\"Image\":\"http://103.120.178.195/GSGImage/12457983.jpg\",\"Stock\":6799.0,\"Rate\":45.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"WET\",\"Image_url\":\"http://103.120.178.195/GSGImage/12457983.jpg\"},{\"Id\":13813,\"Name\":\"PRO PLAN STERILISED WET CAT FOOD, BEEF IN GRAVY,10 X 85G\",\"Code\":\"12458106\",\"Image\":\"http://103.120.178.195/GSGImage/12458106.jpg\",\"Stock\":6444.0,\"Rate\":45.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"WET\",\"Image_url\":\"http://103.120.178.195/GSGImage/12458106.jpg\"},{\"Id\":13817,\"Name\":\"PRO PLAN ADULT DELICATE DIGESTION, TURKEY 24 X 85G\",\"Code\":\"12514245\",\"Image\":\"http://103.120.178.195/GSGImage/12514245.png\",\"Stock\":6155.0,\"Rate\":113.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"WET\",\"Image_url\":\"http://103.120.178.195/GSGImage/12514245.png\"},{\"Id\":13814,\"Name\":\"PRO PLAN STERILISED ADULT WET CAT FOOD, CHICKEN 10 X 85G\",\"Code\":\"12550823\",\"Image\":\"http://103.120.178.195/GSGImage/12550823.jpg\",\"Stock\":5738.0,\"Rate\":45.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"WET\",\"Image_url\":\"http://103.120.178.195/GSGImage/12550823.jpg\"},{\"Id\":13828,\"Name\":\"PRO PLAN STERILISED ADULT DELICATE DIGESTION CHICKEN, 400 G\",\"Code\":\"12525700\",\"Image\":\"http://103.120.178.195/GSGImage/12525700.png\",\"Stock\":2960.0,\"Rate\":20.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12525700.png\"},{\"Id\":13824,\"Name\":\"PRO PLAN KITTEN HEALTHY START DRY CAT FOOD CHICKEN, 3 KG\",\"Code\":\"12537232\",\"Image\":\"http://103.120.178.195/GSGImage/12537232.png\",\"Stock\":2800.0,\"Rate\":85.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12537232.png\"},{\"Id\":13825,\"Name\":\"PRO PLAN STERILISED ADULT DELICATE DIGESTION CHICKEN, 3 KG\",\"Code\":\"12526864\",\"Image\":\"http://103.120.178.195/GSGImage/12526864.png\",\"Stock\":2800.0,\"Rate\":95.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12526864.png\"},{\"Id\":13821,\"Name\":\"PRO PLAN STERILISED KITTEN HEALTHY START,SALMON 1.5 KG\",\"Code\":\"12419110\",\"Image\":\"http://103.120.178.195/GSGImage/12419110.png\",\"Stock\":2700.0,\"Rate\":60.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12419110.png\"},{\"Id\":13811,\"Name\":\"PRO PLAN EVERYDAY NUTRITION SMALL & MINI ADULT 14 KG CHICKN\",\"Code\":\"12377391\",\"Image\":\"http://103.120.178.195/GSGImage/12377391.png\",\"Stock\":1928.0,\"Rate\":274.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12377391.png\"},{\"Id\":13812,\"Name\":\"PRO PLAN EVERYDAY NUTRITION SMALL & MINI ADULT 7KG CHICKEN\",\"Code\":\"12367238\",\"Image\":\"http://103.120.178.195/GSGImage/12367238.png\",\"Stock\":1626.0,\"Rate\":152.0,\"CategoryName\":\"ANIMAL FOOD\",\"SubCategoryName\":\"DRY\",\"Image_url\":\"http://103.120.178.195/GSGImage/12367238.png\"}],\"PageSummary\":[{\"TotalRows\":2480,\"TotalPages\":207}]}",
  });
}
