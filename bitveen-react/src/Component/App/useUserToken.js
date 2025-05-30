import { useState } from 'react';

export default function useUserToken() {
    /**
     * userToken is an object containing userUUID and accessToken   
     * @param {*} userToken 
     */ 
    const getUserToken = () => {
        const userTokenString = localStorage.getItem('userToken');
        return userTokenString ? JSON.parse(userTokenString) : undefined;
    };

    /**
     * userToken is an object containing userUUID and accessToken   
     * @param {*} userToken 
     */
    const [userToken, setUserToken] = useState(getUserToken());

    /**
     * userToken is an object containing userUUID and accessToken   
     * @param {*} userToken 
     */ 
    const saveUserToken = userToken => {
        if (!userToken) {
            localStorage.removeItem('userToken');
        } else {
            localStorage.setItem('userToken', JSON.stringify(userToken));
        }
        setUserToken(userToken);
    };

    return {
        setUserToken: saveUserToken,
        userToken
    }
}