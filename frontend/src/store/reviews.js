import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/loadReviews'
const CREATE_REVIEW ='reviews/createReview'

const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
})

export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok) {
        const reviews = await response.json()
        dispatch(loadReviews(reviews))
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
        dispatch(loadReviews(review))
        return review
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

        case CREATE_REVIEW:
            newState = { allReviews: {}, userReviews: {} }
            return newState
        
        default:
            return state
    }
}

export default reviewReducer;