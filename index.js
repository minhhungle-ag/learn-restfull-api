const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productList = require('./data/product.json');
const { v4 } = require('uuid');
const productRouter = require('./routes/product');

const app = express();
const fs = require('fs');

const uuid = v4;
const port = 4001;
const limit = 5;
const page = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: '*',
  })
);

app.use('/products', productRouter);

app.listen(port, () => console.log(`SERVER START AT PORT ${port}`));
