// const http = require('http');
const express = require('express');
// 记录http请求的日志中间件
const morgan = require('morgan');

const cors = require('cors');
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const app = express()

morgan.token('res-data',(req) => {
  const data = JSON.stringify(req.body) || null
  return data
})

app.use(express.json())

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] :referrer :response-time ms :res-data'))

app.get('/',(req,res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/api/notes',(req,res) => {
  res.json(notes)
})

app.get('/api/notes/:id',(req,res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if(note) {
    res.json(note)
  }else{
    res.status(404).end()
  }
})
// 服务端新增笔记功能
app.post('/api/notes',(req,res) => {

  const body = req.body

  if(!body.content) {
    return res.status(400).json({
      error: "content missing!"
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    data: new Date(),
    important: body.important || false
  }

  notes = notes.concat(note)

  res.json(note)
})
// 修改服务端笔记属性 important 功能
app.put('/api/notes/:id',(req,res)=> {
  const body = req.body

  if(!body.content) {
    return res.status(400).json({
      error: "content missing!"
    })
  }

  const note = notes.find(note => note.id === body.id)
  if(note) {
    note.important = !note.important
    res.json(note)
  }else{
    res.status(404).end()
  }
  
})
// 删除笔记功能
app.delete('/api/notes/:id',(req,res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log(`app running at http://127.0.0.1:${PORT}`);
})

const generateId = () => {
  const maxId = notes.length>0
  ? Math.max(...notes.map(note => note.id))
  : 0
  return maxId + 1
}