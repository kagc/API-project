import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeSpot, addImg } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './CreateSpot.css'

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
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
        <div className='createspot-holder'>

        <div className='createspot-line-holder'>

                    <h1 className='createspot-line'>Become a Host</h1>
                </div>

                
      <div className='welcome'> <h3 className='weclome-h3'>Create Your Spot</h3></div>


                <div className='form-holder'>

                   <form className='createspot-css' onSubmit={handleSubmit}>

            <ul className='errorlist'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
                
                <div className='input-holder'>
                {/* <label htmlFor='address'>Where's your place located?</label> */}
                <input type='text'
                placeholder='What is the Street name and number?'
                className='input-line'
                required
                value={address}
                id='address'
                onChange={(e) => setAddress(e.target.value)}></input>

                <input type='text'
                placeholder='In what City is your spot located?'
                className='input-line'
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}></input>

                <input type='text'
                placeholder='Tell us which State'
                className='input-line'
                required
                value={state}
                onChange={(e) => setState(e.target.value)}></input>

                {/* <select 
                className='input-line'
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder='Country'
                    value={country}>
                    <option className='input-line' default value='United States'>United States</option>
                    <option className='input-line' value='Catland'>Catland</option>
                </select> */}

                <input type='text'
                placeholder='And the Country'
                className='input-line'
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}></input>

                <div>
                   <input type='text'
                   placeholder='Give your spot a Name'
                   className='input-line'
                   required
                //    height='100px'
                   value={name}
                   maxLength='50'
                   onChange={(e) => setName(e.target.value)}></input>
                </div>

                <div>
                    <input type='text'
                    placeholder='Add an Image (https://...)'
                    className='input-line'
                    required
                    value={url}
                    maxlength='255'
                    onChange={(e) => setUrl(e.target.value)}></input>
                </div>

                <div>
                    <input type='text'
                    className='input-line'
                    placeholder="Give your guests a brief Description of your place"
                    value={description}
                    required
                    maxlength='255'
                    onChange={(e) => setDescription(e.target.value)}></input>
                </div>

                <div>
                    <input type='number'
                    className='input-line2'
                    placeholder='Now, set your Price'
                    min='1'
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}></input>
                </div>

                </div>

                {/* <div>
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
                    maxlength='255'
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
                    onChange={(event) => setPrice(event.target.value)}></input>
                </div> */}
                <button type='submit'>Submit</button>
            </form> 
                </div>
            
        </div>
    )
}

export default CreateSpot