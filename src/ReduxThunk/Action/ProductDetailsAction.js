import axios from "axios";
import { apiurl } from "../Utils/baseurl";

import { GET_ALL_PODUCTS } from "../Utils/constant.js";

// export const getAllProducts = () => async (dispatch) => {
//     const response = await axios.get(apiurl);
//     return dispatch({ type: GET_ALL_PODUCTS, payload: response.data && response.data });
//   };

  export const getAllProducts = () => async dispatch => {
    try {
        axios({
                method: 'GET',
                url: apiurl,
            })
            .then((response) => {
                dispatch({
                    type: GET_ALL_PODUCTS,
                    payload: response.data
                })
            })
    } catch (err) {}
}