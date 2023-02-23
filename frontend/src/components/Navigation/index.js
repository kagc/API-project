// frontend/src/components/Navigation/index.js
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalButton from '../OpenModalButton';
import CreateSpot from '../CreateSpot';
import SearchInput from "../Search/SearchBar";


function Navigation({ isLoaded }){

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const sessionUser = useSelector(state => state.session.user);
  const [searchCriteria, setSearchCriteria ] = useState("")
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [state, setState] = useState('')

  let states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const submitSearch = async (e) => {
    e.preventDefault()
    if(min === '' && max === ''){
      history.push(`/search/city=${searchCriteria}`)
      setSearchCriteria('')
    }
    if(min !== '' && max === ''){
      history.push(`/search/city=${searchCriteria}/min=${min}`)
      setSearchCriteria('')
      setMin('')
    }
    if(min === '' && max !== ''){
      history.push(`/search/city=${searchCriteria}/max=${max}`)
      setSearchCriteria('')
      setMax('')
    }
    if(min !== '' && max !== ''){
      history.push(`/search/city=${searchCriteria}/min=${min}/max=${max}`)
      setSearchCriteria('')
      setMin('')
      setMax('')
    }
    // alert("Sorry, that function hasn't been implemented yet.")
  }


  return (
    <div className='allnav'>
    <ul className='navbar'>
      <li>
        <NavLink exact to="/" className='home-button'><span>
          <i className="fa-solid fa-box"></i></span><span>Sparebnb</span></NavLink>


      </li>

      <div className="searchbar-holder">
      <form onSubmit={submitSearch} className="searchform">
                        <div className=""><label>City Search</label>
                        <input
                        className="search-input"
                        type="text"
                        // disabled="true"
                        value={searchCriteria}
                        onChange={(e) => {
                            setSearchCriteria(e.target.value)
                        }}
                        title="Searchbar"
                        placeholder="City Name"
                        required
                        minLength="3"></input>
                        </div>

                        <div className='search-section'>
                        <label>Minimum price per night</label>
                        <div className="dollar-amt">
                        $<input
                        type="number"
                        className="min-input"
                        placeholder="0 (optional)"
                        value={min}
                        onChange={(e) => {
                          setMin(e.target.value)
                        }}
                        min="1"
                        title='min'>
                        </input>
                        </div>
                        </div>

                        <div className="search-section">
                        <label>Minimum price per night</label>
                        <div className="dollar-amt">
                        $<input
                        type="number"
                        className="min-input"
                        placeholder="100 (optional)"
                        value={max}
                        onChange={(e) => {
                          setMax(e.target.value)
                        }}
                        min={min !== '' ? +min + 1 : 1}
                        title='max'>
                        </input>
                        </div>
                        </div>
                        
                        <button 
                         id="search-button"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </form>
        </div>
        <div className="nav-right">
{sessionUser !== null &&
            (<div className='create-holder'>
              <div className='create-spot-button'>
            <Route path='/'> 
            <OpenModalButton
                buttonText="Sparebnb your home"
                onButtonClick={closeMenu}
                modalComponent={<CreateSpot />}/>
                </Route>
                </div>
            </div>
            )
                }

      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      </div>
    </ul>
    </div>
  );
}

export default Navigation;