import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeSpot, addImg } from '../../store/spots';
import { useModal } from '../../context/Modal';

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('United States')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(1)
    const [url, setUrl ] = useState('')
    const [errors, setErrors] = useState([]);

    const { closeModal } = useModal();

    // useEffect(() => {
    //     console.log(url)
    // }, [url])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newSpot = {
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

        const newImg = {
            url,
            preview: true
        }
        // console.log(newSpot)
        // return
        setErrors([]);
        // return console.log(newImg)

        const createdSpot = await dispatch(makeSpot(newSpot, newImg))
        // .then(closeModal)
        .catch(
            async (res) => {
                const data = await res.json();
                console.log(data.errors)
              if (data && data.errors) setErrors(data.errors);
            }
          );

        if(createdSpot) {
            closeModal()
            history.push(`/spots/${createdSpot.id}`)
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

                <div>
                    <h1>Add an image</h1>
                    <h3>Show what your place looks like.</h3>
                </div>
                <div>
                    <input type='text'
                    placeholder='https://....'
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}></input>
                </div>

                <div>
                    <h1>Create your description</h1>
                    <h3>Share what makes your place special.</h3>
                </div>
                <div>
                    <input type='text'
                    placeholder="You'll have a great time at this comfortable place to stay."
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}></input>
                </div>

                <div>
                    <h1>Now, set your price</h1>
                    <h3>You can change it anytime.</h3>
                </div>
                <div>
                    <input type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></input>
                </div>
                <button type='submit'>Next</button>
            </form>
        </div>
    )
}

export default CreateSpot