import { products, Express, ObjectId } from "./index.js"

let router = Express.Router()

// REPLACE PRODUCT BY ID
router.put('/Products/:id', async (req, res) => {
    let result = await products.replaceOne({ _id: ObjectId(req.params.id) }, req.body)
    res.json({ Success: result.modifiedCount > 0, Message: "Successfully updated item " + req.params.id })
})


// DELETE PRODUCT BY ID
router.delete('/Products/:id', async (req, res) => {
    let result = await products.deleteOne({ _id: ObjectId(req.params.id) })

    if (result.deletedCount > 0) {
        res.json({ Success: true, Message: "Successfully deleted item " + req.params.id } )
    } else {
        res.json({ Success: false, Message: "This item was not found." })
    }
})


// PATCH PRODUCT FIELD BY ID
router.patch('/Products/:id/:field', async (req, res) => {
    let update = {}
    update[req.params.field.charAt(0).toUpperCase() + req.params.field.slice(1).toLowerCase()] = req.body.value
    await products.update({ _id: ObjectId(req.params.id) }, { $set : update } )
    res.json(await products.findOne({ _id: ObjectId(req.params.id) }))
})


// PRODUCTS
router.get('/Products/Page/:skip/:limit', async (req, res) => {
    res.json(await products.find().skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).toArray())
})

export { router as Part3 }