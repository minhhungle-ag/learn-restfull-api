const express = require('express')
const multer = require('multer')
const productList = require('../data/product.json')
const sharp = require('sharp')

const fs = require('fs')
const router = express.Router()

const { v4 } = require('uuid')
const uuid = v4

const limit = 5
const page = 1

function writeToFile(newProductList) {
	try {
		fs.writeFileSync('./data/product.json', JSON.stringify(newProductList), () =>
			console.log('write file success')
		)
		res.status(200).json('OK')
	} catch (error) {
		console.log({ error })
	}
}

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload a valid image file'))
		}
		cb(undefined, true)
	},
})

// get all
router.get('/', (req, res) => {
	if (req.query.page <= 0) {
		res.status(500).json('what do you want')
	}

	const startIdx = ((req.query.page || page) - 1) * (req.query.limit || limit)
	const newProductList = [...productList]
	const total = newProductList.length
	const totalPage = Math.ceil(newProductList.length / (req.query.limit || limit))

	res.status(200).json({
		pagination: {
			page: req.query.page || page,
			limit: req.query.limit || limit,
			total: total,
			total_page: totalPage,
		},
		data: newProductList.splice(startIdx, req.query.limit || limit),
	})
})

//get by id
router.get('/:id', (req, res) => {
	const id = req.param('id')
	const newProductList = [...productList]
	const newProduct = newProductList.find((item) => item.id === id)

	res.status(200).json(newProduct)
})

// add product
router.post('/', (req, res) => {
	// get product
	const product = {
		id: `${uuid()}`,
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		color: req.body.color,
	}

	const newProductList = [product, ...productList]

	writeToFile(newProductList)

	res.status(200).json(product)
})

// update product
router.put('/:id', (req, res) => {
	const id = req.param('id')
	const newProductList = [...productList]
	const idx = newProductList.findIndex((item) => item.id === id)

	newProductList[idx] = {
		id: newProductList[idx].id,
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		color: req.body.color,
	}

	writeToFile(newProductList)

	res.status(200).json(newProductList[idx])
})

router.delete('/:id', (req, res) => {
	const id = req.param('id')
	const newProductList = [...productList]
	const idx = newProductList.findIndex((item) => item.id === id)

	newProductList.splice(idx, 1)

	writeToFile(newProductList)

	res.status(200).json(`Deleted ${id}`)
})

// upload image
router.post('/image', upload.single('upload'), async (req, res) => {
	try {
		await sharp(req.file.buffer).toFile(__dirname + `../uploads/${req.file.originalname}`)
		res.status(201).send('Image uploaded succesfully')
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
})

module.exports = router
