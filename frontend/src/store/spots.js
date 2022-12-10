

const ADD_SPOT = 'spots/addSpot'
const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_ONE = 'spots/loadOne'
const EDIT_SPOT = 'spots/editSpot'
const DELETE_SPOT = 'spots/deleteSpot'

const add = (spot) => ({
    type: ADD_SPOT,
    spot
})

const allSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

const oneSpot = (spotId) => ({
    type: LOAD_ONE,
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
    const response = await fetch(`api/spots`);

    if(response.ok){
        const spots = await response.json()
        dispatch(allSpots(spots))
    }
}

export const getOneSpot = (spotId) => async dispatch => {
    const response = await fetch(`api/spots/${spotId}`);

    if(response.ok){
        const spot = await response.json()
        dispatch(oneSpot(spot))
    }
}

const initialState = {}


const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ADD_SPOT:
            return

        case LOAD_SPOTS:
            const allSpots = {}
            action.spots.Spots.forEach(spot => {
                allSpots[spot.id] = spot
            })
            return {
                ...allSpots,
                ...state
            }

        case LOAD_ONE:
            const singleSpot = {}
            return

        case EDIT_SPOT:
            return

        case DELETE_SPOT:
            return

        default:
            return state;
    }
}

export default spotReducer;