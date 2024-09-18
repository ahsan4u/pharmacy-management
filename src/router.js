const express = require('express');
const {Medicines, Bills} = require('./module');

const router = express.Router();

router.route('/').get((req, res)=> {
    res.render('home', {home: 'home text'});
});


router.route('/sale').get((req, res)=> {
    res.render('sale', {name: 'hii'});
});


router.route('/stock').get((req, res)=> {
    res.render('stock');
});


router.route('/add-medicine').get(addMedicine = (req, res)=> {
    res.render('add-medicine');
});


router.route('/sales-book').get((req, res)=> {
    res.render('sales-book');
});

// suggesion Search handler on Sale page
router.route('/medicines/:key').get(async (req, res) => {
    const key = req.params.key;
    try {
        const data = await Medicines.find({ name: { $regex: key, $options: 'i' } }).limit(3);
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }
});

// searched item adding
router.route('/items/:key').get( async (req, res)=> {
    let key = req.params.key;
    try {
        const data = await Medicines.findOne({ name: { $regex: key, $options: 'i' } });
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }   
})

// Upload Bill to database
router.route('/upload-bill').post( async (req, res)=> {
    try {
        console.log(req.body);
        await Bills.create({
            username: req.body.username,
            totalAmount: req.body.totalAmt,
            pendingAmount: req.body.pendingAmount,
            products: req.body.products
        })
        res.redirect('sale');
    } catch (error) {
        res.status(500).send('Something went wrong on server page: '+err);
    }
})

// uploading new Medicine
router.route('/add-medicine').post(async (req, res)=> {
    try {
        const body = req.body;

        if(!body) {
            return;
        }

        await Medicines.create({
            name: body.name,
            formula: body.formula,
            price: body.price,
            qty: body.qty,
            exp: body.expDate
        })
        res.render('add-medicine', {msg: 'Successfully Added'});
    } catch (error) {
        const err = `You Can't leave any cell as empty`;
        res.render('add-medicine', {err});
    }    
        
})

module.exports = router;