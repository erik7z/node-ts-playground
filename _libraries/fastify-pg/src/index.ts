import fastify from 'fastify'
import fs from 'fs'
import { Readable } from "stream";
import XLSX from 'xlsx'

const server = fastify()

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get('/buffer', (req, reply) => {
  const buffer = fs.readFileSync('./tmp/example.xlsx')
  reply.type('application/vnd.ms-excel')
  reply.send(buffer)
})

server.get('/buffer-stream', (req, reply) => {
  const buffer = fs.readFileSync('./tmp/example.xlsx')
  const myStream = new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    }
  })

  reply.type('application/vnd.ms-excel')
  reply.send(myStream)
})

server.get('/stream', (req, reply) => {
  const stream = fs.createReadStream('./tmp/example.xlsx')

  reply.type('application/vnd.ms-excel')
  return reply.send(stream)
})

server.get('/simple-xls', (req, reply) => {
  const stream = fs.createReadStream('./tmp/example.xlsx')

  reply.type('application/vnd.ms-excel')
  return reply.send(stream)
})

server.get('/generated-xls-stream', async (req, reply) => {
  const rows = [
    {name: 'Vasya', surname: 'Batareykin'},
    {name: 'Petya', surname: 'Kryshkin'}
  ]

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  for await (const i of Array(5)) {
    console.log('hi')
    await new Promise((r) => setTimeout(r , 1000))
  }

  reply.type('application/vnd.ms-excel')
  reply.header('Content-Disposition','attachment; filename="SheetJS.xlsx"')
  reply.send(XLSX.write(workbook, {type:"buffer", bookType: "xlsx"}))
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
