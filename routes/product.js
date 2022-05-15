const express = require("express");
const productList = require("../data/product.json");

const fs = require("fs");
const router = express.Router();

const { v4 } = require("uuid");
const uuid = v4;

const limit = 5;
const page = 1;

// get all
router.get("/", (req, res) => {
  if (req.query.page <= 0) {
    res.status(500).json("what do you want");
  }

  const startIdx = ((req.query.page || page) - 1) * (req.query.limit || limit);
  const newProductList = [...productList];
  const total = newProductList.length;
  const totalPage = Math.ceil(
    newProductList.length / (req.query.limit || limit)
  );

  res.status(200).json({
    pagination: {
      page: req.query.page || page,
      limit: req.query.limit || limit,
      total: total,
      total_page: totalPage,
    },
    data: newProductList.splice(startIdx, req.query.limit || limit),
  });
});

//get by id
router.get("/:id", (req, res) => {
  const id = req.param("id");
  const newProductList = [...productList];
  const newProduct = newProductList.find((item) => item.id === id);

  res.status(200).json(newProduct);
});

// add product
router.post("/", (req, res) => {
  const product = {
    id: `${uuid()}`,
    name: req.body.name,
    price: req.body.price,
  };

  const newProductList = [product, ...productList];

  fs.writeFileSync("./data/product.json", JSON.stringify(newProductList), () =>
    console.log("write file success")
  );

  res.status(200).json(product);
});

// update product
router.put("/:id", (req, res) => {
  const id = req.param("id");
  const newProductList = [...productList];
  const idx = newProductList.findIndex((item) => item.id === id);

  newProductList[idx].name = req.body.name;
  newProductList[idx].price = req.body.price;

  fs.writeFileSync("./data/product.json", JSON.stringify(newProductList), () =>
    console.log("write file success")
  );

  res.status(200).json(newProductList[idx]);
});

router.delete("/:id", (req, res) => {
  const id = req.param("id");
  const newProductList = [...productList];
  const idx = newProductList.findIndex((item) => item.id === id);
  newProductList.splice(idx, 1);

  fs.writeFileSync("./data/product.json", JSON.stringify(newProductList), () =>
    console.log("write file success")
  );

  res.status(200).json(`Deleted ${id}`);
});

// router.get("/generate_data", (req, res) => {
//   let string_data = JSON.stringify(productList);

//   fs.writeFileSync("./data/product.json", string_data, () =>
//     console.log("write file success")
//   );
// });

module.exports = router;
