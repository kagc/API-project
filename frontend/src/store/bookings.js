import { csrfFetch } from './csrf';

const LOAD_BOOKINGS = '/bookings/loadBookings'
const USER_BOOKINGS = '/bookings/userBookings'
const ADD_BOOKING = '/bookings/addBooking'
const EDIT_BOOKING = '/bookings/editBooking'
const DELETE_BOOKING = '/bookings/deleteBooking'

const allBookings = (bookings) => ({
    type: LOAD_BOOKINGS,
    bookings
})

const usersBookings = (bookings) => ({
    type: USER_BOOKINGS,
    bookings
})

const add = (booking) => ({
    type: ADD_BOOKING,
    booking
})

const edit = (booking) => ({
    type: EDIT_BOOKING,
    booking
})

const remove = (booking) => ({
    type: DELETE_BOOKING,
    booking
})

export const getAllBookings = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)

    if (response.ok) {
        const bookings = await response.json()
        dispatch(allBookings(bookings))
        return bookings
    }
}

export const getUserBookings = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`)

    if (response.ok) {
        const bookings = await response.json()
        dispatch(usersBookings(bookings))
        return bookings
    }
}

export const createBooking = (newBooking) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${newBooking.spotId}/bookings`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking)
    })
    if (response.ok) {
        const booking = await response.json()
        dispatch(add(booking))
        return booking
    }
}

export const modBooking = (bookingData) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${bookingData.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    if (response.ok) {
        const booking = await response.json()
        dispatch(add(booking))
        return booking
    }
}

export const removeBooking = (bookingId) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if(response.ok){
        const deletedBooking = await response.json()
        dispatch(remove(deletedBooking))
    }
}

const initialState = { allBookings: {}, userBookings: {} }

const bookingReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_BOOKINGS:
            newState = { ...state, allBookings: {} }
            action.bookings.Bookings.forEach(booking => {
                newState.allBookings[booking.id] = booking
            })
            return newState

        case USER_BOOKINGS:
            newState = { ...state, userBookings: {} }
            action.bookings.Bookings.forEach(booking => {
                newState.userBookings[booking.id] = booking
            })
            return newState

        case ADD_BOOKING:
            newState = { ...state, allBookings: { ...state.allBookings }, userBookings: { ...state.userBookings }}
            newState.allBookings[action.booking.id] = action.booking
            newState.userBookings[action.booking.id] = action.booking
            return newState

        case DELETE_BOOKING: 
            newState = { ...state, allBookings: { ...state.allBookings }, userBookings: { ... state.userBookings }}
            delete newState.allBookings[action.bookingId]
            delete newState.userBookings[action.bookingId]
            return newState

        default: 
            return state
    }
}

export default bookingReducer