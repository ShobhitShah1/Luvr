import { DONATION_PRODUCTS, RESET } from '../Action/actions';

const initialState = {
  donationProducts: [],
};

const donationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case DONATION_PRODUCTS:
      return {
        ...state,
        donationProducts: action.donationProducts || [],
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default donationReducer;
