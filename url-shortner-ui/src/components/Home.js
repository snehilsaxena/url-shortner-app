import React, { useState } from 'react';
import './Home.css';
import { Button, IconButton } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Home() {
    const [url, setUrl] = useState('');
    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState('success');
    const [message, setMessage] = React.useState('');
    const [custom, setCustom] = React.useState(false);
    const [customUrl, setCustomUrl] = React.useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // alert("Form Submitted");
        axios.post('http://localhost:8080/api/url/shorten', { longUrl: url, customUrl: customUrl })
            .then((response) => {
                console.log(response.data.shortUrl);
                if (response.data.customUrl) {
                    setMessage("Shortened url is : " + 'http://localhost:8080/'+response.data.customUrl);
                } else {
                    setMessage("Shortened url is : " + response.data.shortUrl);
                }
                setSeverity('success');
                setOpen(true);
            })
            .catch((err) => {
                console.log(err.response.data);
                setMessage(err.response.data);
                setSeverity('error');
                setOpen(true);
            });
    }

    const handleCustom = () => {
        if(custom){
            setCustomUrl('');
        }
        setCustom(!custom);
    }

    return (
        <React.Fragment>
            <div className="home_center">
                <h1>Welcome to URL Shortner</h1>
            </div>
            <form onSubmit={handleFormSubmit} >
                <div className="home_inputContainer">
                    <input type="text" value={url} onChange={(e) => { setUrl(e.target.value) }} placeholder="Enter your link..." />
                    <IconButton type="submit">
                        <Send />
                    </IconButton>
                </div>

                {
                    (custom) ?
                        <div className="home_inputContainer">
                            <input type="text" value={customUrl} onChange={(e) => { setCustomUrl(e.target.value) }} placeholder="Enter custom link..." style={{ padding: "10px 10px 10px 2px" }} />
                        </div>
                        :
                        ''
                }

                <div className="home_checkboxContainer">
                    <Checkbox
                        checked={custom}
                        onChange={handleCustom}
                        name="Custom link ?"
                        color="primary"
                    />
                    <span>Custom link?</span>
                </div>
            </form>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

export default Home;