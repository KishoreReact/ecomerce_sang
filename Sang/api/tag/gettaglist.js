export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "Failed",
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  const { tagId } = req.query;

  // ✅ Mock response for tagId = 3008
  if (tagId === "3008") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Record(s) successfully retrieved.",
      result:
        "[{\"Id\":83,\"Name\":\"BIODOSE\",\"Code\":\"Biodose\",\"ProductCount\":1},{\"Id\":13,\"Name\":\"BIOPANDA\",\"Code\":\"Biopanda\",\"ProductCount\":10},{\"Id\":15,\"Name\":\"CUPET\",\"Code\":\"CUPET\",\"ProductCount\":15},{\"Id\":16,\"Name\":\"DAN INJECT\",\"Code\":\"Dan Inject\",\"ProductCount\":17},{\"Id\":18,\"Name\":\"EICKEMEYER\",\"Code\":\"EICKEMEYER\",\"ProductCount\":854},{\"Id\":19,\"Name\":\"EUROLYSER\",\"Code\":\"EUROLyser\",\"ProductCount\":19},{\"Id\":20,\"Name\":\"FIONIA VET\",\"Code\":\"Fionia Vet\",\"ProductCount\":215},{\"Id\":24,\"Name\":\"GENIA\",\"Code\":\"Genia\",\"ProductCount\":110},{\"Id\":28,\"Name\":\"H&O EQUIPMENTS\",\"Code\":\"H&O Equipments\",\"ProductCount\":1},{\"Id\":74,\"Name\":\"HENKE SASS\",\"Code\":\"henke sass\",\"ProductCount\":27},{\"Id\":32,\"Name\":\"IMEX\",\"Code\":\"IMEX\",\"ProductCount\":1},{\"Id\":82,\"Name\":\"LOCAL BRAND\",\"Code\":\"Local Brand\",\"ProductCount\":3},{\"Id\":43,\"Name\":\"MILA\",\"Code\":\"Mila\",\"ProductCount\":64},{\"Id\":44,\"Name\":\"MINDRAY\",\"Code\":\"Mindray\",\"ProductCount\":43},{\"Id\":46,\"Name\":\"MINITUBE\",\"Code\":\"Minitube\",\"ProductCount\":763},{\"Id\":3,\"Name\":\"NESTLE\",\"Code\":\"NESTLE\",\"ProductCount\":96},{\"Id\":53,\"Name\":\"REMEDY\",\"Code\":\"REMEDY\",\"ProductCount\":3},{\"Id\":62,\"Name\":\"SUTUMED\",\"Code\":\"Sutumed\",\"ProductCount\":59},{\"Id\":63,\"Name\":\"SYNTEX\",\"Code\":\"Syntex - T\",\"ProductCount\":2},{\"Id\":65,\"Name\":\"TOEX\",\"Code\":\"TOEX\",\"ProductCount\":18},{\"Id\":86,\"Name\":\"VETINNOV\",\"Code\":\"VETINNOV\",\"ProductCount\":4},{\"Id\":68,\"Name\":\"VETNOVA\",\"Code\":\"VetNova\",\"ProductCount\":12},{\"Id\":2,\"Name\":\"VETOQUINOL\",\"Code\":\"VETOQUINOL\",\"ProductCount\":68},{\"Id\":70,\"Name\":\"WILDLIFE PHARMACEUTICALS\",\"Code\":\"Wildlife Pharmaceuticals\",\"ProductCount\":2},{\"Id\":72,\"Name\":\"ZOETIS\",\"Code\":\"Zoetis\",\"ProductCount\":48},{\"Id\":73,\"Name\":\"ZOOVET\",\"Code\":\"Zoovet\",\"ProductCount\":25}]"
    });
  }

  // ✅ Mock response for tagId = 3004
  if (tagId === "3004") {
    return res.status(200).json({
      status: "Success",
      statusCode: 2000,
      message: "Record(s) successfully retrieved.",
      result:
        "[{\"Id\":103,\"Name\":\"ANIMAL FOOD\",\"Code\":\"ANIMAL FOOD\",\"ProductCount\":96},{\"Id\":104,\"Name\":\"NON-FOOD\",\"Code\":\"NON-FOOD\",\"ProductCount\":2384}]"
    });
  }

  // ✅ Default for unknown tagId
  return res.status(404).json({
    status: "Success",
    statusCode: 2000,
    message: "No records found for this tagId.",
    result: "[]",
  });
}
