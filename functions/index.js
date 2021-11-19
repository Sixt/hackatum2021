const functions = require("firebase-functions")
const admin = require('firebase-admin')
const express = require('express')

const app = express();

admin.initializeApp({
    credential: admin.credential.applicationDefault()
})

//createTestData()

const vehicleController = require('./controller/vehicle')
const bookingController = require('./controller/booking');
const { create } = require("domain");

app.use(database);

app.get('/vehicles', vehicleController.list)
app.get('/vehicles/:id', vehicleController.get)
app.post('/vehicles/:id/coordinates', vehicleController.updateCoordinates)
app.post('/vehicles/:id/charge', vehicleController.updateCharge)
app.post('/vehicles/:id/block', vehicleController.serviceBlock)
app.post('/vehicles/:id/unblock', vehicleController.serviceUnblock)

app.get('/bookings', bookingController.list)
app.get('/bookings/:id', bookingController.get)
app.post('/bookings', bookingController.create)
app.delete('/bookings/:id', bookingController.cancel)
app.post('/bookings/:id/assignVehicle/:vehicleId', bookingController.assignVehicle)
app.post('/bookings/:id/passengerGotOn', bookingController.passengerGotOn)
app.post('/bookings/:id/passengerGotOff', bookingController.passengerGotOff)

exports.api = functions.https.onRequest(app);


async function database(req, res, next) {
    req.db = admin.firestore()
    next()
}

async function createTestData() {
    const db = admin.firestore()
    const vehicles = await db.collection('vehicles').get()
    if (!vehicles.empty) {
        console.log('test data already created. skipping...')
        return
    }

    const testData = [
        {lat: 48.1411259559854, lng: 11.564591269895596, charge: 100},
        {lat: 48.141455284205165, lng: 11.575019698173595, charge: 100},
        {lat: 48.13431868375863, lng: 11.560677159384943, charge: 96},
        {lat: 48.15136748667542, lng: 11.572146360320891, charge: 83},
        {lat: 48.16174229710019, lng: 11.586843629797913, charge: 76},
        {lat: 48.161325069455856, lng: 11.577461160884159, charge: 80},
        {lat: 48.15533061859121, lng: 11.555838954728802, charge: 99},
        {lat: 48.13979681821804, lng: 11.539934161565183, charge: 50},
        {lat: 48.131931268415926, lng: 11.546019297499674, charge: 65},
        {lat: 48.11316410588998, lng: 11.585750435704867, charge: 90},
        {lat: 48.10164910921263, lng: 11.567190424653084, charge: 70},
        {lat: 48.10789950665855, lng: 11.636634268330798, charge: 30},
        {lat: 48.12704604488845, lng: 11.643226819804276, charge: 45},
        {lat: 48.187587196105575, lng: 11.562029342019544, charge: 80},
        {lat: 48.19270306524782, lng: 11.59039526350017, charge: 100},
        {lat: 48.15576842255551, lng: 11.514845743058148, charge: 20},
        {lat: 48.12565323016478, lng: 11.587108041587578, charge: 30},
        {lat: 48.11955488725314, lng: 11.549926303220962, charge: 100},
        {lat: 48.14187129838962, lng: 11.60236443102774, charge: 97},
        {lat: 48.154183853041644, lng: 11.582905683362053, charge: 100},
        {lat: 48.12845822484943, lng: 11.570572674989407, charge: 100},
        {lat: 48.11510263969329, lng: 11.579068747841635, charge: 10},
        {lat: 48.104610887016676, lng: 11.604922389474845, charge: 100},
        {lat: 48.096618638390474, lng: 11.646032420222419, charge: 0},
        {lat: 48.093445798051775, lng: 11.569933186009669, charge: 10},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 100},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 70},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 100},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 100},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 56},
        {lat: 48.04323044296281, lng: 11.510139695252404, charge: 100},
        {lat: 48.04574981111989, lng: 11.526944149121897, charge: 100},
        {lat: 48.35105850644367, lng: 11.787496296722862, charge: 100},
        {lat: 48.35499658770829, lng: 11.790003269550036, charge: 70},
        {lat: 48.34894240989115, lng: 11.761044881363674, charge: 100},
        {lat: 48.34894240989115, lng: 11.761044881363674, charge: 89},
        {lat: 48.26337177723579, lng: 11.663886768568604, charge: 34},
        {lat: 48.262486128475764, lng: 11.663672191855063, charge: 45},
        {lat: 48.262029013434365, lng: 11.664230091310268, charge: 20},
    ]

    testData.forEach(vehicle => {
        const doc = db.collection('vehicles').doc()
        const data = {vehicleID: doc.id, lat: vehicle.lat, lng: vehicle.lng, charge: vehicle.charge, status: 'FREE'}
        doc.set(data)
    })

    console.log('TEST DATA CREATED')
    
}


