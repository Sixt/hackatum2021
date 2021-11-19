# SIXT / hackaTUM 2021

Welcome to the SIXT challenge @hackatum2021. This year everything is about robo taxis. At IAA we announced our cooperation with Intel / MobileEye to launch a level 4 robo taxi service in Munich later in 2022 [TechCrunch](https://guce.techcrunch.com/copyConsent?sessionId=3_cc-session_76df026c-7bce-405b-b34f-bf9c42ae2eff&lang=en-US)

Its up to you: Build something great around robo taxi / autonomous vehicles!

Some ideas: 
- Where should a vehicle go after a passenger dropped off? The car can't just wait on a busy street.
- Which vehicle fits best for serving a booking?
- For development we probably need a automatic simulator for our booking engine
- Build trust
- Come up with your own idea!


# API

We are sharing a very simple API with you for building your prototyp. If you need something else please get in touch with the SIXT team.

Base URL  `https://us-central1-sixt-hackatum-2021.cloudfunctions.net/api`

## Vehicles

### Fetching all vehicles
`GET /vehicles`

### Fetching a single vehicle by ID
`GET /vehicles/:id`

#### Updating the coordinates of a vehicle
`POST /vehicles/:id/coordinates`
with JSON body:
```
{
	"lat": 48.04323044296281,
	"lng": 11.510139695252404
}
```

#### Updating the battery charge of a vehicle (0-100)
`POST /vehicles/:id/charge`
with JSON body:
```
{
	"charge": 95
}
```

### Set a vehicle for service block
`POST /vehicles/:id/block`

### Unblock a vehicle
`POST /vehicles/:id/unblock`

## Bookings

### Fetching all bookings
`GET /bookings`

### Fetching a single booking by ID
`GET /bookings/:id`

### Create a booking
`POST /bookings`
with JSON body:
```
{
	"pickupLat": 48.04323044296281,
	"pickupLng": 11.510139695252404,
    "destinationLat": 48.1411259559854,
	"destinationLng": 11.564591269895596
}
```

### Cancel a booking by ID
`DELETE /bookings/:id`

### Assign a vehicle to a booking
`POST /bookings/:id/assignVehicle/:vehicleId`

### If the vehicle arrived at the pickup location the passenger needs to confirm that he/she got in the car
`POST /bookings/:id/passengerGotOn`

### If the vehicle arrived at the pickup location the passenger needs to confirm that he/she got off the car
`POST /bookings/:id/passengerGotOff`

## Booking lifecycle

1. Create a booking
2. Assign a vehicle to the booking
3. Confirm that the passenger is in the car
4. Confirm that the passenger is off the car


# Jobs

We are a international team with 300+ engineers always looking for new talented and higly motivated people to join us.

You are a student and looking for a great working student opportunity (or get in touch with us during the Hackaton):

- Frontend (React) Engineering: https://www.sixt.jobs/de/job/60168
- Backend Cloud Engineering (Go/Java): https://www.sixt.jobs/de/job/60169
- iOS or Android Engineering: https://www.sixt.jobs/de/job/60175

You are already a professional engineer? Get in touch with the SIXT team.

