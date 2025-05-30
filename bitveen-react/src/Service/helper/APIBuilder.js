import axios from "axios";

const setAuth = () => {
    // import userToken
    const userTokenString = localStorage.getItem('userToken');
    const userToken = userTokenString ? JSON.parse(userTokenString) : undefined;

    if (!userToken) {
        // ASK FOR LOGIN HERE
        alert('Signin is required. Please signin.');
        return;
    }
    axios.defaults.headers.common['authorizations'] = userToken.accessToken;
    axios.defaults.headers.withCredentials = true;
}

export default async function APIBuilder(method, url, data = {}, isAuth = true) {

    if (isAuth) { setAuth() };
    let api_response = await axios({
        method,
        url,
        data
    })
    .then((res) => {
        return res;
    })
    return api_response
}