import { GET_ALL_PODUCTS } from '../Utils/constant';

const intialState = {
    getAllProducts: {},

}

export default function (state = intialState, action) {
    switch (action.type) {
        case GET_ALL_PODUCTS:
            return {  ...state,getAllProducts:action.payload}
        default:
            return state;
    }

}

