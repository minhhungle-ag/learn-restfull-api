const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const productRouter = require('./routes/product')

const app = express()
const port = 4001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
	cors({
		origin: '*',
	})
)

app.use('/products', productRouter)

app.listen(port, () => console.log(`SERVER START AT PORT ${port}`))
