
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017";


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri);
  const users = await client.db("mydb").collection("users").find({}).toArray()
  await client.close()
  res.status(200).send(users)
})

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const client = new MongoClient(uri);
  const user = await client.db("mydb").collection("users").findOne({"id":id})
  await client.close()
  res.status(200).send({
    "status":"ok",
    "user":user
  })
})

app.post('/users/create', async (req, res) => {
  const user = req.body
  const client = new MongoClient(uri);
  const database = await client.db("mydb").collection("users").insertOne({
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  })
  await client.close()
  res.status(200).send({
    "status": "ok",
    "message": "User with ID" + user.id + " is created",
    "user": user

  })

})

app.put('/users/update', async (req, res) => {
  const user = req.body
  const id = user.id
  const client = new MongoClient(uri);
  const database = await client.db("mydb").collection("users").updateOne({"id":id},{"$set":{
    fname : user.fname,
    lname : user.lname,
    username: user.username,
    email : user.email,
    avatar: user.avatar
  }})
  await client.close()
  res.status(200).send({
    "status": "ok",
    "message":"User with ID ="+ id + "is updated",
    "user": user

  })

})

app.delete('/users/delete', async(req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
  const user = await client.db("mydb").collection("users").deleteOne({"id":id})
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with ID = "+id+" is deleted"
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})