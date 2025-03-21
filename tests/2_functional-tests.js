const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
test('Viewing one stock: GET request to /api/stock-prices/', function(done){
    chai.request(server)
    .get('/api/stock-prices')
    .query({stock: 'goog'})
    .end((err, res) => {
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.equal(res.status, 200)
        done();
    })
})
test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done){
    chai.request(server)
    .get('/api/stock-prices')
    .query({
        stock: 'goog',
        like: true
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        done()
    })
})
test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done){
    chai.request(server)
    .get('/api/stock-prices')
    .query({
        stock: 'goog',
        like: true
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        chai.request(server)
        .get('/api/stock-prices')
        .query({
            stock: 'goog',
            like: true
        })
        .end((err, res) => {
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        done()
        })
    })
})
test('Viewing two stocks: GET request to /api/stock-prices/', function(done){
    chai.request(server)
    .get('/api/stock-prices')
    .query({
        stock: ['GOOG', 'MSFT']
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        done();
    })
})
test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done){
    chai.request(server)
    .get('/api/stock-prices')
    .query({
        stock: ['GOOG', 'MSFT'],
        like: true
    })
    .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
    })
})
});
