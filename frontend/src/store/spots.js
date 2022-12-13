import { csrfFetch } from './csrf';

// const ADD_SPOT = 'spots/addSpot'
const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_ONE = 'spots/loadOne'
const EDIT_SPOT = 'spots/editSpot'
const DELETE_SPOT = 'spots/deleteSpot'
const IMG = 'spots/addImg'

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

const img = (link, spotId) => ({
    type: IMG,
    link,
    spotId
})

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
    }
}

export const getOneSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);

    if(response.ok){
        const spot = await response.json()
        // console.log(spot)
        dispatch(oneSpot(spot))
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
        
// export const addImg = (link, spotId) => async dispatch => {
//         const response = await csrfFetch(`/api/spots/${spotId}`, {
//             method: 'POST',
//             body: JSON.stringify(link)
//         })
//         if(response.ok){
//             const createdImage = await response.json()
//             dispatch(img(createdImage))
//         }
// }


export const nukeSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        const deletedSpot = await response.json()
        dispatch(eviscerate(deletedSpot))
    }
}

const initialState = {}


const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        // case IMG:
        //     const spotImgs = { ...state,
        //     [action.]}

        case LOAD_SPOTS:
            const allSpots = {}
            // console.log(action.spot.Spots)
            action.spots.Spots.forEach(spot => {
                allSpots[spot.id] = spot
            })
            return {
                ...state,
                ...allSpots
            }

        case LOAD_ONE:
            // console.log('aaaa', state.spots[action.spot.id])
            // if(!state.spots[action.spot.id]) {
            //     console.log('newState', action.spot)
            //     newState = { 
            //         [action.spot.id]: action.spot}
            //         return newState
            // }
            // console.log('action.spot', action.spot)
            const singleSpot = { ...state,
                [action.spot.id]: action.spot
                }
            // const singleSpot = { ...action.spot }
                // console.log('Reducer singleSpot', singleSpot)
            return {
                ...singleSpot}

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