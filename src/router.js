const express = require('express');
const {Medicines, Bills} = require('./module');

const router = express.Router();

//1 print Add Home page
router.route('/').get((req, res)=> {
    res.render('home', {home: 'home text'});
});


//2 print Add Sale page
router.route('/sale').get((req, res)=> {
    res.render('sale', {name: 'hii'});
});


//3 print Add Stock page
router.route('/stock').get((req, res)=> {
    res.render('stock');
});

function medicineOBJ(medicines) {
    return medicines.flatMap(medicine=> 
    medicine.date.map((date)=> {
        const exp = new Date(date.exp);
        return {
            name: medicine.name,
            formula: medicine.formula,
            price: date.price,
            qty: date.qty,
            exp: `${exp.getDate()}/${exp.getMonth()+1}/${exp.getFullYear()}`
        }
    }));
}

//4 Find and Print Medicine data 
router.route('/medicines/:type/:key').get( async (req, res)=> {
    const type = req.params.type;
    const key = req.params.key;
    if(key == 'empty') {
        const data = await Medicines.find();
        res.json(medicineOBJ(data));    
    }
    else if(type == 'name') {
        const data = await Medicines.find({ name: { $regex: key, $options: 'i' } });
        res.json(medicineOBJ(data));
    } else {
        const data = await Medicines.find({ formula: { $regex: key, $options: 'i' } });
        res.json(medicineOBJ(data));
    }
})

//5 print Add Medicine page
router.route('/add-medicine').get((req, res)=> {
    res.render('add-medicine');
});


//6 print Add Sales Book page
router.route('/sales-book').get((req, res)=> {
    res.render('sales-book');
});

//7 suggesion Search handler on Sale page
router.route('/medicines/:key').get(async (req, res) => {
    const key = req.params.key;
    try {
        const data = await Medicines.find({ name: { $regex: key, $options: 'i' } }).limit(6);
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }
});

//8 searched item adding
router.route('/items/:key').get( async (req, res)=> {
    let key = req.params.key;
    try {
        const data = await Medicines.findOne({ name: { $regex: key, $options: 'i' } });
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }   
})

//9 Upload Bill to database
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

//10 uploading new Medicine via Add Medicine Page
router.route('/add-medicine').post(async (req, res)=> {
    try {
        const body = req.body;

        if(!body) {
            return;
        }
        const isExist = await Medicines.findOne({name: body.name, formula: body.formula})
        if(isExist) {
            isExist.date.push({qty: body.qty, exp: body.expDate, price: body.price});
            isExist.save();
            res.render('add-medicine', {msg: 'Successfully Added in existing data'});
            return;
        }

        await Medicines.create({
            name: body.name,
            formula: body.formula,
            date: {
                qty: body.qty,
                price: body.price,
                exp: body.expDate
            }
        })
        res.render('add-medicine', {msg: 'Successfully Added'});
    } catch (error) {
        const err = `You Can't leave any cell as empty`;
        console.log(error);
        res.render('add-medicine', {err});
    }    
        
})

module.exports = router;