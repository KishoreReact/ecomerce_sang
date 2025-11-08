export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { category } = req.query;

  console.log("Mock getsubcategorybycategory params:", req.query);

  // ✅ Mock data for category = 103
  if (category === "103") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Record(s) successfully retrieved.",
      result:
        "[{\"data\":\"[{\\\"Id\\\":105,\\\"Name\\\":\\\"MAINTENANCE DIET\\\",\\\"Code\\\":\\\"MAINTENANCE DIET\\\",\\\"ProductCount\\\":70,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":108,\\\"Name\\\":\\\"DOG FOOD\\\",\\\"Code\\\":\\\"DOG FOOD MD\\\",\\\"ProductCount\\\":31,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":114,\\\"Name\\\":\\\"DRY\\\",\\\"Code\\\":\\\"DRY DFMD\\\",\\\"ProductCount\\\":31,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]},{\\\"Id\\\":115,\\\"Name\\\":\\\"WET\\\",\\\"Code\\\":\\\"WET DFMD\\\",\\\"ProductCount\\\":0,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]}]},{\\\"Id\\\":109,\\\"Name\\\":\\\"CAT FOOD\\\",\\\"Code\\\":\\\"CAT FOOD MD\\\",\\\"ProductCount\\\":39,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":116,\\\"Name\\\":\\\"DRY\\\",\\\"Code\\\":\\\"DRY CFMD\\\",\\\"ProductCount\\\":25,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]},{\\\"Id\\\":117,\\\"Name\\\":\\\"WET\\\",\\\"Code\\\":\\\"WET CFMD\\\",\\\"ProductCount\\\":14,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]}]}]},{\\\"Id\\\":106,\\\"Name\\\":\\\"VETERINARY DIET\\\",\\\"Code\\\":\\\"VETERINARY DIET\\\",\\\"ProductCount\\\":22,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":110,\\\"Name\\\":\\\"DOG FOOD\\\",\\\"Code\\\":\\\"DOG FOOD VD\\\",\\\"ProductCount\\\":11,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":118,\\\"Name\\\":\\\"DRY\\\",\\\"Code\\\":\\\"DRY DFVD\\\",\\\"ProductCount\\\":9,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]},{\\\"Id\\\":119,\\\"Name\\\":\\\"WET\\\",\\\"Code\\\":\\\"WET DFVD\\\",\\\"ProductCount\\\":2,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]}]},{\\\"Id\\\":111,\\\"Name\\\":\\\"CAT FOOD\\\",\\\"Code\\\":\\\"CAT FOOD VD\\\",\\\"ProductCount\\\":11,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":120,\\\"Name\\\":\\\"DRY\\\",\\\"Code\\\":\\\"DRY CFVD\\\",\\\"ProductCount\\\":6,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]},{\\\"Id\\\":121,\\\"Name\\\":\\\"WET\\\",\\\"Code\\\":\\\"WET CFVD\\\",\\\"ProductCount\\\":5,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[]}]}]},{\\\"Id\\\":107,\\\"Name\\\":\\\"FOOD SUPPLEMENTS\\\",\\\"Code\\\":\\\"FOOD SUPPLEMENTS\\\",\\\"ProductCount\\\":4,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\",\\\"SubCategories\\\":[{\\\"Id\\\":112,\\\"Name\\\":\\\"FORTIFLORA\\\",\\\"Code\\\":\\\"FORTIFLORA\\\",\\\"ProductCount\\\":2,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\"},{\\\"Id\\\":113,\\\"Name\\\":\\\"HYDRA CARE\\\",\\\"Code\\\":\\\"HYDRA CARE\\\",\\\"ProductCount\\\":2,\\\"Image\\\":\\\"http:\\\\/\\\\/103.120.178.195\\\\/GSGImage\\\\/NoImage.jpg\\\"}]}]\"}]"
    });
  }

  // ✅ Fallback for unknown category
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "No records found.",
    result: "[]",
  });
}
