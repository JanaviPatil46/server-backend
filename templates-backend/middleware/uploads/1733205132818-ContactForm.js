
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { AiOutlinePlusCircle, AiOutlineDelete } from 'react-icons/ai';
import {
    Button,
    Box,
    Typography,
    useMediaQuery,
    Chip,
    MenuItem,
    Select, ListItem,
    TextField,
    InputLabel,
    Autocomplete
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './contact.css';

import { toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
const ContactForm = ({ handleNewDrawerClose, handleDrawerClose }) => {

    const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    // Individual state hooks for form fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactName, setContactName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [note, setNote] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [combinedValues, setCombinedValues] = useState([]);

    console.log(selectedCountry);
    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then((response) => {
                const countryData = response.data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                setCountries(countryData);
            })
            .catch((error) =>
                console.error('Error fetching country data:', error)
            );
    }, []);

    const handlePhoneNumberChange = (id, phone) => {
        setPhoneNumbers((prevPhoneNumbers) =>
            prevPhoneNumbers.map((item) =>
                item.id === id ? { ...item, phone } : item
            )
        );
    };

    // Update contactName when firstName, middleName, or lastName changes
    useEffect(() => {
        setContactName(`${firstName} ${middleName} ${lastName}`.trim());
    }, [firstName, middleName, lastName]);

    const handleAddPhoneNumber = () => {
        setPhoneNumbers((prevPhoneNumbers) => [
            ...prevPhoneNumbers,
            { id: Date.now(), phone: '', isPrimary: false },
        ]);
    };

    const handleDeletePhoneNumber = (id) => {
        setPhoneNumbers((prevPhoneNumbers) =>
            prevPhoneNumbers.filter((item) => item.id !== id)
        );
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
        setCountry(event.target.value);
    };

    const sendingData = async (e) => {
        e.preventDefault();
        handleNewDrawerClose()
        handleDrawerClose()

        const raw = JSON.stringify([{

            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            contactName: contactName,
            companyName: companyName,
            note: note,
            ssn: ssn,
            email: email,
            login: false,
            notify: false,
            emailSync: false,
            tags: combinedValues,
            country: {
                name: "South Georgia",
                code: "GS"
            },
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            phoneNumbers: phoneNumbers.map((phone) => phone.phone),

        }])
        console.log(raw)
        const requestOptions = {
            method: "POST",

            headers: {
                'Content-Type': 'application/json',
            },
            body: raw,
            redirect: "follow",
        };
        const url = `${CONTACT_API}/contacts/`;
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((result) => {
                // Handle success
                toast.success('Contact created successfully!');
                //console.log('Contact ID:', result);  // Log the contactId

                navigate('/clients/contacts');

                // Additional logic after successful creation if needed
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error('Failed to create contact');

            })
    };

    const handleClose = () => {
        handleNewDrawerClose();
        handleDrawerClose();
    }





    const [selectedTags, setSelectedTags] = useState([]);


    // const handleTagChange = (event) => {
    //     const selectedValues = event.target.value;
    //     setSelectedTags(selectedValues);

    //     // Send selectedValues array to your backend
    //     console.log("Selected Values:", selectedValues