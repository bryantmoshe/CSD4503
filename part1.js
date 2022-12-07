import { products, Express } from "./index.js"

let router = Express.Router()

// ROOT
router.get('/', async (req, res) => {
    res.json(await products.find().toArray())
})


//HIGHEST PRICE
router.get('/highestPrice', async (req, res) => {
    let sort   = { Price: -1 }
    let limit  = 1

    let data = await products.find({}, { projection: { _id: 0, Name: 1, Price: 1 } }).limit(limit).sort(sort).toArray()

    if (data.length > 0)
        res.json(data[0])
    else
        res.send("No data found.")
})

//EARLIEST DATE
router.get('/earliestDate', async (req, res) => {
    let sort   = { StartingDateAvailable: 1 }
    let limit  = 1

    let data = await products.find({}, { projection: { _id: 0, Name: 1, StartingDateAvailable: 1 } }).limit(limit).sort(sort).toArray()
    
    if (data.length > 0)
        res.json(data[0])
    else
        res.send("No data found.")
})


//COMMON COLOUR
router.get('/commonColour', async (req, res) => {

    let data = await products.aggregate([
        {"$group" : {_id: "$Colour", count: { $sum: 1 }}}
    ]).sort({ count: -1 }).toArray()

    let json = { Colour: data[0]._id } 
    res.json(json)
})

//PREMIUM BRAND
router.get('/premiumBrand', async (req, res) => {

    products.bulkWrite([
        { 
            updateMany : {
                filter: { Price: { $gte: 100 } },
                update: { $set: { "Premium_Brand" : true } },
            }
        },
        { 
            updateMany : {
                filter: { Price: { $lt: 100 } },
                update: { $set: { "Premium_Brand" : false } },
            }
        }
    ])

    res.json(await products.find().toArray())
})

//SALE PRICE
router.get('/salePrice', async (req, res) => {

    let data = await products.find().toArray();

    let sales = []

    data.forEach(doc => {
        if (doc.Price >= 100) { 
            doc.Price *= .8
            sales.push(doc)
        }
    })

    sales.forEach(sale => {
        products.updateMany(
            { _id: sale._id },
            { $set: { Sale_Price: sale.Price } },
            { multi: true }
        )
    })

    res.json(await products.find().toArray())
})


//DESCRIPTION
router.get('/large', async (req, res) => {

    let data = await products.find().toArray();
    let largeList = []

    data.forEach(doc => {
        if (doc.Description.includes("large")) 
            largeList.push({ Name: doc.Name, Description: doc.Description })
    })

    res.json(largeList)
})


//RENAME
router.get('/rename', async (req, res) => {
    products.updateMany({}, { $rename: { "Manufacturer": "Produced_By" } })
    res.json(await products.find().toArray())
})



//LONGEST DATE
router.get('/longestDate', async (req, res) => {

    let data = await products.find().toArray();
    let winner = { Name: "", Days: 0 };

    data.forEach(doc => {

        const start = new Date(doc.StartingDateAvailable)
        const end   = new Date(doc.EndingDateAvailable)

        let days = end.getTime() - start.getTime();

        if (winner.Days < days)
            winner = { Name: doc.Name, Days: days / (1000 * 3600 * 24)}
    })

    res.json(winner)
})


//EXPIRED
router.get('/expired', async (req, res) => {

    let data = await products.find().toArray();
    let expired = [];
    
    const today = new Date()
    
    data.forEach(doc => {
        if (new Date(doc.EndingDateAvailable) < today)
        expired.push({ Name: doc.Name, StartDate: doc.StartingDateAvailable, ExpirationDate: doc.EndingDateAvailable})
    })
    
    res.json(expired)
})


//LOWEST PRICE
router.get('/lowestPrice', async (req, res) => {
    let sort   = { Price: 1 }
    let limit  = 1

    let data = await products.find({}).limit(limit).sort(sort).toArray()
    res.json(data)
})



//SEARCH
router.get('/search', async (req, res) => {
    let filter = {}

    if(req.query.s) filter.Size = req.query.s.charAt(0).toUpperCase() + req.query.s.slice(1).toLowerCase();
    if(req.query.m) filter.Material = req.query.m.charAt(0).toUpperCase() + req.query.m.slice(1).toLowerCase();
    
    res.json(await products.find(filter).toArray())
})

export { router as Part1 }