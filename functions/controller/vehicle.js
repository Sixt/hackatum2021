const collection = 'vehicles'

const list = async (req, res) => {  
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

const get = async (req, res) => {  
    try {
        const vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (!vehicle) {
            return res.status(404).json({error: 'error_not_found'})
        }
        res.status(200).json(vehicle)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const updateCoordinates = async (req,res) => {
    try {

        if (isNaN(req.body.lat) || isNaN(req.body.lng)) {
            return res.status(400).json({
                code: 'error_coordinate_missing'
            })
        }

        await req.db.collection(collection).doc(req.params.id).update({
            lat: req.body.lat,
            lng: req.body.lng
        })

        const vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(vehicle)

    } catch(error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const updateCharge = async (req,res) => {
    try {

        if (isNaN(req.body.charge) || req.body.charge < 0 || req.body.charge > 100) {
            return res.status(400).json({
                code: 'error_invalid_charge_value'
            })
        }

        await req.db.collection(collection).doc(req.params.id).update({
            charge: req.body.charge
        })

        const vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(vehicle)

    } catch(error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const serviceBlock = async (req,res) => {
    try {

        let vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        if (!vehicle || vehicle.status !== 'FREE') {
            return res.status(403).json({
                code: 'error_vehicle_not_free'
            })
        }
        
        await req.db.collection(collection).doc(req.params.id).update({
            status: 'SERVICE_BLOCK'
        })

        vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(vehicle)

    } catch(error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

const serviceUnblock = async (req,res) => {
    try {

        let vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()

        if (vehicle.status !== 'SERVICE_BLOCK') {
            return res.status(403).json({
                code: 'error_vehicle_not_blocked'
            })
        }
        
        await req.db.collection(collection).doc(req.params.id).update({
            status: 'FREE'
        })

        vehicle = (await req.db.collection(collection).doc(req.params.id).get()).data()
        res.status(200).json(vehicle)

    } catch(error) {
        console.error(error)
        return res.status(500).json({
            code: 'error_internal_server_error'
        })
    }
}

module.exports = {
    list, get, updateCoordinates, serviceBlock, serviceUnblock, updateCharge
}