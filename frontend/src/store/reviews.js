import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/loadReviews'
const CREATE_REVIEW ='reviews/createReview'
const DELETE_REVIEW = 'reviews/deleteReview'
const USER_REVIEWS = 'reviews/userReviews'

const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
})

const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

const usersReviews = (reviews) => ({
    type: USER_REVIEWS,
    reviews
})

export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok) {
        const reviews = await response.json()
        dispatch(loadReviews(reviews))
        return reviews
    }
    return response
}

export const getUsersReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`)

    if (response.ok){
        const reviews = await response.json()
        dispatch(usersReviews(reviews))
        return reviews
    }
}

export const makeReview = (spotId, newReview) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(newReview)
    })
    if(response.ok){
        const review = await response.json()
        // console.log('first res ok')
        // dispatch(createReview(review))
        // return review
        const response2 = await csrfFetch(`/api/spots/${spotId}/reviews`)

        if(response2.ok){
            const data = await response2.json()
            // console.log('second res ok')
            // return console.log('data', data)
            dispatch(loadReviews(data))
            return data
        // }

        // return console.log(review)
        // return review
    } 
    // else {
    //     const data = await response.json()
    //     console.log('data', data)
    //     return alert(`${data.message}`)
    }
}

export const tossReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        const deletedReview = await response.json()
        dispatch(deleteReview(deletedReview))
        return reviewId
    }
    else {
        const data = await response.json()
        console.log(data)
    }
}

const initialState = { allReviews: {}, userReviews: {} }

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {

        case LOAD_REVIEWS:
            newState = { allReviews: {}, userReviews: {} }
            // console.log(action.reviews)
            action.reviews.Reviews.forEach(review => {
                newState.allReviews[review.id] = review
            })
            return newState

        case USER_REVIEWS:
            newState = { ...state, userReviews: {} }
            // console.log(newState)
            action.reviews.Reviews.forEach(review => {
                newState.userReviews[review.id] = review
            })
            return newState

        case CREATE_REVIEW:
            newState = { ...state, allReviews: { ...state.allReviews} }
            newState.allReviews[action.review.id] = action.review
            return newState

        case DELETE_REVIEW:
            newState = { ...state, allReviews: { ...state.allReviews }, userReviews: { ...state.userReviews }}
            // console.log('old', action.reviewId.id)
            delete newState.allReviews[action.reviewId.id]
            delete newState.userReviews[action.reviewId.id]
            // console.log('post-delete', newState)
            return newState
        
        default:
            return state
    }
}

export default reviewReducer;