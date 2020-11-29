const express = require('express')
const router = express.Router()
const Todo = require('./../models/Todo')
const { ensureAuthenticated } = require('../auth');
const { route } = require('./users');

router.get('/:id/new', async (req, res) => {
    let content = await new Todo()
    content.user = req.params.id
    res.render('list/new', { content: content })
});

router.post('/:id/new', async (req, res) => {

    let temp = await new Todo({
        title : req.body.title,
        desc : req.body.desc,
        user : req.params.id,
    })

    try {
        temp = await temp.save()
        res.redirect('/list/dashboard')
    }
    catch(er) {
        res.render('list/new',{content:temp})
    }

})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const identity =req.user
    const userlist = await Todo.find({user:identity.id}).sort({date:-1})
    res.render('list/dashboard', {
        user: req.user,
        userlist:userlist
    })
})

router.get('/:id/edit',async (req,res)=>{
    const temp = req.params.id;
    let updateid= await Todo.findById(temp)
    res.render('list/edit',{content:updateid})
})

router.put('/:id/edit',async (req,res)=>{
    const temp = req.params.id;
    let updateid= await Todo.findById(temp)
    updateid.title =req.body.title
    updateid.desc =req.body.desc
    updateid.date =Date.now()
    try {
        updateid = await updateid.save()
        res.redirect('/list/dashboard')
    }
    catch(e) {
        res.render('list/edit',{content:updateid})
    }
})

router.put('/:id/edit',async (req,res)=>{
    const temp = req.params.id;
    let updateid= await Todo.findById(temp)
    res.render('list/edit',{content:updateid})
})

router.delete('/:id',async(req,res)=>{
    const temp = req.params.id;
    const delid= await Todo.findById(temp)
    await Todo.findByIdAndDelete(delid)
    res.redirect('/list/dashboard')
})
module.exports = router;