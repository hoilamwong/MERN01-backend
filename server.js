const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 3500

app.use(cors(corsOptions))

app.use(express.json())



app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
  res.status(404)
  if(req.accepts('html')){ //req for html
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  }else if(req.accepts('json')){
    res.json({ message: '404, JSON Not Found'})
  }else{
    res.type('txt').send('404 Not Found :(')
  }
})

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`))