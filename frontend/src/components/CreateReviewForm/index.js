import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { makeReview } from "../../store/reviews";

const CreateReviewForm = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const [review, setReview] = useState()
    const [stars, setStars] = useState(1)
    const [errors, setErrors] = useState([]);

    const reviews = useSelector(state => state.reviews.allReviews)
    console.log(reviews)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        const madeReview = await dispatchEvent(makeReview(spotId, newReview))

        if (madeReview) {
            history.push('')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
            <div>
                {/* <input type='text'
                required
                onChange={(e) => setReview(e.target.value)}> </input> */}

            </div>

            <div>
            <label>
        <input
          type="radio"
          value='1'
          name="star"
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '1'} // sets it to true
        />
        <i className="fa-solid fa-star"></i>
      </label>
      <label>
        <input
          type="radio"
          value='2'
          name="star"
          // defaultChecked={seeds === 'yes' ? 'true' : 'false'} -- nope
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '2'}
        />
        <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
      </label>
            </div>

            </form>
        </div>
    )
}

export default CreateReviewForm;