import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modSpot, getOneSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './EditSpot.css'

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
        <div className='editspot-holder'>

<div className='createspot-line-holder'>

<h1 className='createspot-line'>Make Changes</h1>
</div>


<div className='welcome'> <h3 className='weclome-h3'>Edit Your Spot Info</h3></div>

<div className='form-holder'>
<form className='editspot-css' onSubmit={handleSubmit}>
            <ul className='errorlist'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
                
                <div className='input-holder'>
                {/* <label htmlFor='address'>Where's your place located?</label> */}
                <input type='text'
                className='input-line'
                placeholder='Street'
                required
                value={address}
                id='address'
                onChange={(e) => setAddress(e.target.value)}></input>

                <input type='text'
                className='input-line'
                placeholder='City'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}></input>

                <input type='text'
                className='input-line'
                placeholder='State'
                required
                value={state}
                onChange={(e) => setState(e.target.value)}></input>

<input type='text'
                placeholder='Country'
                className='input-line'
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}></input>
                

                
                <div>
                   <input type='text'
                   className='input-line'
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
                    <input type='text'
                    className='input-line'
                    placeholder="Description"
                    value={description}
                    required
                    maxlength='255'
                    onChange={(e) => setDescription(e.target.value)}>
                    </input>
                </div>

               
                <div>
                    <input type='number'
                    className='input-line2'
                    placeholder='Price'
                    min='1'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></input>
                </div>

                </div>
                <button type='submit'>Submit</button>
            </form>

</div>
            
        </div>
    )
}

export default EditSpot