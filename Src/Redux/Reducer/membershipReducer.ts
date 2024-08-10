import {MEMBERSHIP_PRODUCTS, RESET} from '../Action/actions';

const initialState = {
  membershipProducts: [],
};

const membershipReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case MEMBERSHIP_PRODUCTS:
      return {
        ...state,
        membershipProducts: action.membershipProducts || [],
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default membershipReducer;
