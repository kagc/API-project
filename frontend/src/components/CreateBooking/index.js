import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { makeReview } from "../../store/reviews";
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from "../ReviewsBySpot";
import { useModal } from '../../context/Modal';

const CreateBookingForm = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    return (
        <></>
    )
}

export default CreateBookingForm;