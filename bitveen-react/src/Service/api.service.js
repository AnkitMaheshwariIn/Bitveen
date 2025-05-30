import axios from "axios";
import APIBuilder from "./helper/APIBuilder";
const { BASEURL } = require("../config/conf")

export const login = (keys) => {
    try {
        return axios.post(`${BASEURL}/login`, {
            username: keys.username,
            password: keys.password,
        })
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const loginWithGoogle = (profile) => {
    try {
        return axios.post(`${BASEURL}/login/withGoogle`, profile)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getAllByPaginationAPI = (limit, skip) => {
    try {
        // isAuth is false in this API because any one can read article without login
        // fetch article-by-pagination
        return APIBuilder('get', `${BASEURL}/article-by-pag?limit=${limit}&skip=${skip}`, {}, false)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getArticleByLinkAPI = (articleLink, userUUID) => {
    try {
        // isAuth is false in this API because any one can read article without login
        return APIBuilder('post', `${BASEURL}/article-link`, { articleLink, userUUID }, false)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getArticlesByUser = (userUUID) => {
    try {
        return APIBuilder('get', `${BASEURL}/article?userUUID=${userUUID}`)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getArticlesByUUID = (articleUUID) => {
    try {
        return APIBuilder('get', `${BASEURL}/article?uuid=${articleUUID}`)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getArticlesByUsername = (username) => {
    try {
        return APIBuilder('get', `${BASEURL}/article-username?username=${username}`, {}, false)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const saveArticle = (article) => {
    try {
        return APIBuilder('post', `${BASEURL}/article`, article)
        //return axios.post(`${BASEURL}/article`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const updateArticle = (uuid, article) => {
    try {
        return APIBuilder('patch', `${BASEURL}/article/${uuid}`, article)
        //return axios.post(`${BASEURL}/article`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const deleteArticle = (articleUUID) => {
    try {
        return APIBuilder('delete', `${BASEURL}/article/${articleUUID}`)
        //return axios.post(`${BASEURL}/article`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const saveHeart = (heart) => {
    try {
        return APIBuilder('put', `${BASEURL}/heart`, heart)
        //return axios.post(`${BASEURL}/article`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

// export const getHeartCountAPI = (articleUUID) => {
//     try {
//         return APIBuilder('get', `${BASEURL}/heart/by/${articleUUID}`)
//     } catch (err) {
//         throw new Error('Unable to get a token.')
//     }
// }

export const uplaodImage = (formData) => {
    try {
        return APIBuilder('post', `${BASEURL}/storage/uploadFile`, formData)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

/*
export const getImage = (UUID) => {
    try {
        return APIBuilder('get', `${BASEURL}/storage?uuid=${UUID}`)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}
*/

export const saveArticleForLater = (article) => {
    try {
        return APIBuilder('post', `${BASEURL}/savedArticle`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const getSavedForLaterAPI = (articleUUID, userUUID) => {
    try {
        return APIBuilder('get', `${BASEURL}/savedArticle/by/${articleUUID}/${userUUID}`)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const deleteArticleForLater = (article) => {
    try {
        return APIBuilder('delete', `${BASEURL}/savedArticle`, article)
    } catch (err) {
        throw new Error('Unable to get a token.')
    }
}

export const putFollowedAPI = (followData) => {
    try {
        return APIBuilder('put', `${BASEURL}/user/follow`, followData)
    } catch (err) {
        throw new Error('Unable to put a token.')
    }
}
