import { useState } from "react";
import { useSelector } from "react-redux";
import { makeReview } from "../../store/reviews";

const CreateReviewForm = ({spot}) => {

    const [review, setReview] = useState()
    const [stars, setStars] = useState(1)

    const reviews = useSelector(state => state.reviews.allReviews)
    console.log(reviews)

    return (
        <div>

        </div>
    )
}

export default CreateReviewForm;