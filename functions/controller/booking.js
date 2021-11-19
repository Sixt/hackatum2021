const collection = 'bookings'

const create = async (req,res) => {
    try {
        if (isNaN(req.body.pickupLat) || isNaN(req.body.pickupLng) || isNaN(req.body.destinationLat) || isNaN(req.body.destinationLng)) {
            return res.status(400).json({
                code: 'error_pickup_destination_missing'
            })
        }
        const doc = req.db.collection(collection).doc()
        const data = {
            bookingID: doc.id, 
            pickupLat: req.body.pickupLat,
            pickupLng: req.body.pickupLng,
            destinationLat: req.body.destinationLat, 
            destinationLng: req.body.destinationLng, 
            status: 'CREATED'
        }
        await doc.set(data)
        res.status(200).json(data)
    } catch(error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const list = async (req,res) => {
    try {
        const snapshot = await req.db.collection(collection).get()
        let data = []
        snapshot.forEach(doc => {
            data.push(doc.data())
        })
        res.status(200).json(data)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const get = async (req,res) => {
    try {
        const booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (!booking) {
            return res.status(404).json({error: 'error_not_found'})
        }
        res.status(200).json(booking)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const cancel = async (req,res) => {
    try {
        const booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (booking.vehicleID && ['VEHICLE_ASSIGNED', 'STARTED'].includes(booking.status)) {
            await req.db.collection('vehicles').doc(booking.vehicleID).update({
                status: 'FREE'
            })
        } 
        await req.db.collection(collection).doc(req.params.id).delete()
        res.status(200).json({deleted: req.params.id})
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}


const assignVehicle = async (req,res) => {
    try {
        let booking = (await req.db.collection(collection).doc(req.params.id).get()).data()

        if (!booking || booking.status !== 'CREATED') {
            return res.status(403).json({
                code: 'error_only_allowed_in_state_created'
            })
        }

        const vehicle = (await req.db.collection('vehicles').doc(req.params.vehicleId).get()).data()
        if (!vehicle || vehicle.status !== 'FREE') {
            return res.status(403).json({
                code: 'error_vehicle_not_free'
            })
        }

        await req.db.collection(collection).doc(booking.bookingID).update({
            status: 'VEHICLE_ASSIGNED', 
            vehicleID: vehicle.vehicleID
        })

        await req.db.collection('vehicles').doc(vehicle.vehicleID).update({
            status: 'BOOKED'
        })

        booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(booking)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const passengerGotOn = async (req,res) => {
    try {
        let booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (!booking || booking.status !== 'VEHICLE_ASSIGNED') {
            return res.status(403).json({
                code: 'error_only_allowed_in_status_vehicle_assigned'
            })
        }

        await req.db.collection(collection).doc(booking.bookingID).update({
            status: 'STARTED',
            startedAt: new Date().toISOString()
        })

        await req.db.collection('vehicles').doc(booking.vehicleID).update({
            lat: booking.pickupLat,
            lng: booking.pickupLng
        })

        booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(booking)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const passengerGotOff = async (req,res) => {
    try {
        let booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (!booking || booking.status !== 'STARTED') {
            return res.status(403).json({
                code: 'error_only_allowed_in_status_vehicle_assigned'
            })
        }

        await req.db.collection(collection).doc(booking.bookingID).update({
            status: 'COMPLETED',
            completedAt: new Date().toISOString()
        })

        await req.db.collection('vehicles').doc(booking.vehicleID).update({
            status: 'FREE',
            lat: booking.destinationLat,
            lng: booking.destinationLng
        })

        booking = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(booking)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}


module.exports = {
    list, create, get, cancel, assignVehicle, passengerGotOn, passengerGotOff
}