'use strict';
const { ObjectId, MongoClient } = require("mongodb")
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("project2");
const coll = db.collection("IP Address");

const bcrypt = require('bcrypt');

async function fetchData(symbol){
  const res = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`)
  const handle = await res.json()
  const price = handle.latestPrice
  //console.log('price:', price)
  return price
}
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
     //console.log(req)
      let stock = req.query.stock
      console.log(Array.isArray(stock))
      let like = req.query.like === "true" ? true : false;
      let ipAdd = like ? req.ip : "-1";
      console.log(stock, like, ipAdd)
      if(!stock){
        return res.status(400).json({error: 'required field missing'})
      }
      const hashedIp = bcrypt.hashSync(ipAdd, 10)
      console.log('hashed: ', hashedIp)
      const docToSave = {
        stock: stock,
        ip: ipAdd,
        hashedIp: hashedIp
      }
    
      console.log('check stock array:', Array.isArray(stock))
      if(!Array.isArray(stock)){
      const price = await fetchData(stock);

      console.log('price in the func:', price)
      const resultData = {
        stock: stock,
        price: price,
        likes: 0
      }
      if(like){
        resultData.likes++
      }
      try{
        const savedAPI = await coll.insertOne(docToSave)
        console.log('saved:', savedAPI)
      return res.json({'stockData': resultData})
    }catch(e){
      console.error(e)
      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }
    else{
      const price1 = await fetchData(stock[0])
      const price2 = await fetchData(stock[1])
      const resultData1 = {
        stock: stock[0],
        price: price1,
        rel_likes: 0
      }
      const resultData2 = {
        stock: stock[1],
        price: price2,
        rel_likes: 0
      }
      try{
        const savedAPI = await coll.insertOne(docToSave)
        console.log('saved:', savedAPI)
      return res.json({
        'stockData': [
          resultData1, resultData2
        ]
      })}
      catch(e){
        console.error(e)
        return res.json({
          error: 'Internal server error'
        })
      }
    }
    })

};