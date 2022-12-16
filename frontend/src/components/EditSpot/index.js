import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modSpot, getOneSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';

const EditSpot = ({spot}) => {
    // const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
console.log(spot)
    // useEffect(() => {
    //     dispatch(getOneSpot(spotId))
    // }, [dispatch, spotId])

    // const spot = useSelector(state => state.spots.singleSpot[spotId])
    console.log('spot', spot)

    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    // const [url, setUrl ] = useState('')

    // const [address, setAddress] = useState('')
    // const [city, setCity] = useState('')
    // const [state, setState] = useState('')
    // const [country, setCountry] = useState('United States')
    // const [name, setName] = useState('')
    // const [description, setDescription] = useState('')
    // const [price, setPrice] = useState(1)
    // const [url, setUrl ] = useState('')
    
    const [errors, setErrors] = useState([]);

    const { closeModal } = useModal()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const editedSpot = {
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat: 123.321,
            lng: 321.123
        }

        setErrors([]);

        const moddedSpot = await dispatch(modSpot(spot.id, editedSpot))
        // .then(closeModal)
        .catch(
            async (res) => {
                const data = await res.json();
                console.log(data.errors)
              if (data && data.errors) setErrors(data.errors);
            }
          );

        if(moddedSpot) {
            closeModal()
            history.push(`/spots/${moddedSpot.id}`)
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
                    <h1>Where's your place located?</h1>
                </div>
                <div>
                {/* <label htmlFor='address'>Where's your place located?</label> */}
                <input type='text'
                placeholder='Street'
                required
                value={address}
                id='address'
                onChange={(e) => setAddress(e.target.value)}></input>

                <input type='text'
                placeholder='City'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}></input>

                <input type='text'
                placeholder='State'
                required
                value={state}
                onChange={(e) => setState(e.target.value)}></input>

                <select 
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}>
                    <option default value='United States'>United States</option>
                    <option value='Catland'>Catland</option>
                </select>
                </div>

                <div>
                    <h1>Now, let's give your place a title</h1>
                    <h3>Short titles work best. Have fun with it—you can always change it later.</h3>
                </div>
                <div>
                   <input type='text'
                   placeholder='Name'
                   required
                //    height='100px'
                   value={name}
                   onChange={(e) => setName(e.target.value)}></input>
                </div>

                {/* <div>
                    <h1>Add an image</h1>
                    <h3>Show what your place looks like.</h3>
                </div> */}
                {/* <div>
                    <input type='text'
                    placeholder='https://....'
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}></input>
                </div> */}

                <div>
                    <h1>Create your description</h1>
                    <h3>Share what makes your place special.</h3>
                </div>
                <div>
                    <input type='text'
                    placeholder="You'll have a great time at this comfortable place to stay."
                    value={description}
                    required
                    maxlength='255'
                    onChange={(e) => setDescription(e.target.value)}></input>
                </div>

                <div>
                    <h1>Now, set your price</h1>
                    <h3>You can change it anytime.</h3>
                </div>
                <div>
                    <input type='number'
                    min='1'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></input>
                </div>
                <button type='submit'>Next</button>
            </form>
        </div>
    )
}

export default EditSpot