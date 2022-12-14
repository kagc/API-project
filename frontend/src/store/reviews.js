import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/loadReviews'

const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})

export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok) {
        const reviews = await response.json()
        dispatch(loadReviews(reviews))
        return reviews
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
        
        default:
            return state
    }
}

export default reviewReducer;