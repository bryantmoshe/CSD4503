import { products, Express, ObjectId } from "./index.js"

let router = Express.Router()

// PRODUCTS
router.get('/Products', async (req, res) => {
    res.json(await products.find().toArray())
})


// PRODUCTS / IDENTIFIERS
router.get('/Products/identifiers', async (req, res) => {
    res.json(await products.find({}, { projection: { _id: 1 } }).toArray())
})


// PRODUCTS / IMAGES / {FILENAME}
router.get('/Products/images/:filename', async (req, res) => {
    let data = await products.findOne({ Image: req.params.filename })

    if (data) {
       res.download("./images/" + data.Image + ".jpg")
    } else {
        res.send("No data found.")
    }
})


// PRODUCTS / {ID}
router.get('/Products/:id', async (req, res) => {
    res.json(await products.findOne({_id: ObjectId(req.params.id)}))
})


// PRODUCTS / {ID} / {FIELD}
router.get('/Products/:id/:field', async (req, res) => {
    let projection = { _id: 0 }
    projection[req.params.field.charAt(0).toUpperCase() + req.params.field.slice(1).toLowerCase()] = 1;
    res.json(await products.findOne({_id: ObjectId(req.params.id)}, { projection }))
})

export { router as Part2 }