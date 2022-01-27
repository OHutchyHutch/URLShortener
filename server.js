const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap-icons'));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls, shortquery: req.query.short})
})
app.post('/create/shortUrl' , async (req, res) => {
    await ShortUrl.create({ full: req.body.createURL })
    res.redirect('/')
})
app.post('/delete/:shortUrl', async (req, res) =>{
    await ShortUrl.deleteOne({ short: req.params.shortUrl})
    res.redirect('/')
})
app.post('/edit/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    res.redirect(`/?short=${shortUrl.short}`)
})
app.post('/editsave/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    shortUrl.short = req.body.shortURLedit
    shortUrl.save()
    res.redirect(`/`)
})
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)