
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let BrowsingHistory = require('../models/browsingHistory');
let async = require('async');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
var assert = chai.assert; 

chai.use(chaiHttp);


var prepareBrowsingHistoryArr = function () {
    var browsingHistoryArr = [];
    let browsingHistory = new BrowsingHistory({ url: 'www.google.com', time: Date.now(), referrer: 'www.google.com' });
    browsingHistoryArr.push(browsingHistory);
    let browsingHistory2 = new BrowsingHistory({ url: 'www.google.com', time: Date.now(), referrer: 'www.google.com' });
    browsingHistoryArr.push(browsingHistory2);
    let browsingHistory3 = new BrowsingHistory({ url: 'www.google.com', time: Date.now(), referrer: 'www.google.com' });
    browsingHistoryArr.push(browsingHistory3);
    let browsingHistory4 = new BrowsingHistory({ url: 'www.google.com', time: Date.now(), referrer: 'www.google.com' });
    browsingHistoryArr.push(browsingHistory4);
    let browsingHistory5 = new BrowsingHistory({ url: 'www.google.com', time: Date.now(), referrer: 'www.google.com' });
    browsingHistoryArr.push(browsingHistory5);
    return browsingHistoryArr;
}

var saveSeveralBrowsingHistory = function (fnCb) {
    var browsingHistoryArr = prepareBrowsingHistoryArr();
    async.each(browsingHistoryArr, function (browsingHistory, asyncCb) {
        browsingHistory.save((err, browsingHistory) => {
            if (err) {
                console.log("I have an error in saving browsingHistory, error is " + err);
            }
            asyncCb();
        });
    }, function () {
        fnCb()
    });
}


describe('BrowsingHistorys', () => {
    beforeEach((done) => { //Before each test we empty the database
        BrowsingHistory.remove({}, (err) => {
            done();
        });
    });
    describe('/GET browsingHistory', () => {
        it('it should GET all the browsingHistorys - fetch empty results on empty db', (done) => {
            chai.request(server)
                .get('/api/browsingHistorys')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET all the browsingHistory db has 5 records', function (done) {
            this.timeout(10000);
            saveSeveralBrowsingHistory(function () {
                chai.request(server)
                    .get('/api/browsingHistorys')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(5);
                        done();
                    });
            });
        });
    });

    describe('/POST browsingHistory', () => {
        it('it should POST a browsingHistory', (done) => {
            let nowDate = Date.now().toString();
            let browsingHistory = {
                url: 'www.google.com',
                time: nowDate,
                referrer: 'www.google.com',
                iframes: ['www.google.com', 'www.google.com']
            }
            chai.request(server)
                .post('/api/browsingHistorys')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(browsingHistory)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('url').eql('www.google.com');
                    res.body.data.should.have.property('referrer').eql('www.google.com');
                    res.body.data.should.have.property('iframes');
                    res.body.data.iframes.length.should.be.eql(2);
                    res.body.data.iframes[0].should.be.eql('www.google.com');
                    res.body.data.iframes[1].should.be.eql('www.google.com');
                    res.body.data.should.have.property('time');
                    var time = res.body.data.time;
                    var timeMillisDate = new Date(time);
                    var nowDateNew = new Date(parseInt(nowDate));
                    assert(timeMillisDate.getTime() === nowDateNew.getTime(), 'date time is not the same ');
                    done();
                });
        });

        it('it should POST a browsingHistory with empty referrer and empty iframes', (done) => {
            let nowDate = Date.now().toString();
            let browsingHistory = {
                url: 'www.google.com',
                time: nowDate
            }
            chai.request(server)
                .post('/api/browsingHistorys')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(browsingHistory)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('referrer').eql('EMPTY_REFERRER');
                    res.body.data.should.not.have.property('iframes');                    
                    done();
                });
        });

    });

    describe('/GET/:id browsingHistory', () => {
        it('it should GET a browsingHistory by the given id', (done) => {
            let nowDate = Date.now();
            let browsingHistory = new BrowsingHistory({
                url: 'www.google.com',
                time: nowDate, 
                referrer: 'www.google.com'
            });
            browsingHistory.save((err, browsingHistory) => {
                chai.request(server)
                    .get('/api/browsingHistorys/' + browsingHistory.id)
                    .send(browsingHistory)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('url').eql('www.google.com');
                        res.body.should.have.property('referrer').eql('www.google.com');
                        res.body.should.have.property('time');
                        var time = res.body.time;
                        var timeMillisDate = new Date(time);
                        var nowDateNew = new Date(parseInt(nowDate));
                        assert(timeMillisDate.getTime() === nowDateNew.getTime(), 'date time is not the same ');
                        done();
                    });
            });

        });
    });
});

