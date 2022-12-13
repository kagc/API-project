import { csrfFetch } from './csrf';

// const ADD_SPOT = 'spots/addSpot'
const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_ONE = 'spots/loadOne'
const EDIT_SPOT = 'spots/editSpot'
const DELETE_SPOT = 'spots/deleteSpot'
const IMG = 'spots/addImg'
const USER_SPOTS = 'spots/userSpots'

// const add = (spot) => ({
//     type: ADD_SPOT,
//     spot
// })

const allSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

const oneSpot = (spot) => ({
    type: LOAD_ONE,
    spot
})

const usersSpots = (spots) => ({
    type: USER_SPOTS,
    spots
})

// const img = (link, spotId) => ({
//     type: IMG,
//     link,
//     spotId
// })

const edit = (spotId) => ({
    type: EDIT_SPOT,
    spotId
})

const eviscerate = (spotId) => ({
    type: DELETE_SPOT,
    spotId
})

export const getAllSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if(response.ok){
        const spots = await response.json()
        dispatch(allSpots(spots))
        return spots
    }
}

export const getOneSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if(response.ok){
        const spot = await response.json()
        // console.log(spot)
        dispatch(oneSpot(spot))
        return spot
    }
}

export const getUserSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`)

    if(response.ok){
        const spots = await response.json()
        dispatch(usersSpots(spots))
        return spots
    }
}


export const makeSpot = (newSpot, newImg) => async dispatch => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: JSON.stringify(newSpot)
        })
        if(response.ok){
            const createdSpot = await response.json()
            const response2 = await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify(newImg)
                })

                dispatch(oneSpot(createdSpot))
                return createdSpot
            }
        }

export const nukeSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        const deletedSpot = await response.json()
        dispatch(eviscerate(deletedSpot))
    }
}

export const modSpot = (spotId, editedSpot) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(editedSpot)
    })
    if (response.ok){
        const revisedSpot = await response.json()
        dispatch(oneSpot(revisedSpot))
        return revisedSpot
    }
}

const initialState = { allSpots: {}, singleSpot: {}, userSpots: {} }


const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {

        case LOAD_SPOTS:
            // newState = {}
            newState = { allSpots: {}, singleSpot: {}, userSpots: {} }
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
            return newState
            // newState = { ...state }
            // action.spots.Spots.forEach(spot => {
            //     newState.allSpots[spot.id] = spot
            // })
            // console.log('newstate', newState)

            // return newState

        case LOAD_ONE:
            // console.log('aaaa', state.spots[action.spot.id])
            // if(!state.spots.singleSpot[action.spot.id]) {
            //     console.log('newState', action.spot)
            //     newState = { 
            //         [action.spot.id]: action.spot}
            //         return newState
            // }
            
            newState = { allSpots: {}, singleSpot: {}, userSpots: {} }
            newState.singleSpot[action.spot.id] = action.spot

            return newState

        case USER_SPOTS:
            newState = { allSpots: {}, singleSpot: {}, userSpots: {} }
            action.spots.Spots.forEach(spot => {
                newState.userSpots[spot.id] = spot
            })
            return newState

        case EDIT_SPOT:
            return

        case DELETE_SPOT:
            newState = { ...state }
            delete newState[action.spotId]
            return newState

        default:
            return state;
    }
}

export default spotReducer;