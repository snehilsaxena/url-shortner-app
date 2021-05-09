import axios from "axios";

const getShortenUrl = (url, customUrl) => {
    return axios.post('http://localhost:8080/api/url/shorten', { longUrl: url, customUrl: customUrl });
}

export default getShortenUrl;
