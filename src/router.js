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
        return {
            name: medicine.name,
            formula: medicine.formula,
            price: date.price,
            qty: date.qty,
            exp: date.exp
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

// 5 Delete medicine From Stock
router.route('/medicine/delete').post( async (req, res)=> {
    try {
        const body = req.body;
        const name = body.name;
        const formula = body.formula;
        const exp = body.exp;
        
        await Medicines.findOneAndUpdate({name, formula}, {$pull: {date: {exp}}});
        if(result.date.length === 0) {
            await Medicines.deleteOne({name, formula});
            console.log('completly Deleted');
        }
        res.end();
        
    } catch (error) {
        res.send(error);
    }
})

// 6 Edite a Medicine from Stocks
router.route('/medicine/update').post( async (req, res)=> {
    const body = req.body;
    await Medicines.findOneAndUpdate({name: body.name, formula: body.formula},
        {$set: { "date.$[elem].qty": body.qty, "date.$[elem].price": body.price }},
        {arrayFilters: [{"elem.exp": body.exp}]});
    res.end();
})

//6 print Add Medicine page
router.route('/add-medicine').get((req, res)=> {
    res.render('add-medicine');
});


//7 print Add Sales Book page
router.route('/sales-book').get((req, res)=> {
    res.render('sales-book');
});

//8 suggesion Search handler on Sale page
router.route('/medicines/:key').get(async (req, res) => {
    const key = req.params.key;
    try {
        const data = await Medicines.find({ name: { $regex: key, $options: 'i' } }).limit(6);
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }
});

//9 searched item adding in Bill
router.route('/items/:key').get( async (req, res)=> {
    let key = req.params.key;
    try {
        const data = await Medicines.findOne({ name: { $regex: key, $options: 'i' } });
        res.json(data);
    } catch (err) {
        res.status(500).send('Something went wrong on server page: '+err);
    }   
})

//10 Upload Bill to database
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

//11 uploading new Medicine via Add Medicine Page
router.route('/add-medicine').post(async (req, res)=> {
    try {
        const body = req.body;
        if(!body.name || !body.formula || !body.qty || !body.expDate || !body.price) {
            const err = `You Can't leave any cell as empty`;
            res.render('add-medicine', {err});
            return;
        }

        let expDate = new Date(body.expDate);
        const exp = `${expDate.getDate()}/${expDate.getMonth()+1}/${expDate.getFullYear()}`;


        const isExist = await Medicines.findOne({name: body.name, formula: body.formula});
        if(isExist) {
            isExist.date.push({qty: body.qty, exp, price: body.price});
            isExist.save();
            res.render('add-medicine', {msg: 'Successfully Added in existing data'});
            return;
        }

        await Medicines.create({
            name: body.name,
            formula: body.formula,
            date: { qty: body.qty, price: body.price, exp }
        })
        res.render('add-medicine', {msg: 'Successfully Added'});
    } catch (error) {
        console.log(error);
    }    
        
})

module.exports = router;