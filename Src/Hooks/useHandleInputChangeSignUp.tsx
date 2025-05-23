import { useCallback } from 'react';

import { useUserData } from '../Contexts/UserDataContext';

const useHandleInputChangeSignUp = () => {
  const { dispatch } = useUserData();

  const handleInputChange = useCallback(
    (field: string, value: string | boolean) => {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    },
    [dispatch],
  );

  return handleInputChange;
};

export default useHandleInputChangeSignUp;
