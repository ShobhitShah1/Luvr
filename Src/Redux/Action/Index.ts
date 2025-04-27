import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../Store/store';
import { Action } from 'redux';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
