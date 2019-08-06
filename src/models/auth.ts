import { Reducer } from 'redux';
import { query, queryBtn } from '@/services/auth';
import { Effect } from 'dva';

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    fetch: Effect;
    };
  reducers: {
    save: Reducer<any>;
  };
}

export interface AuthModelState {
  authlist?: any[];
  authbtnlist?: any[];
}

const AuthModel: AuthModelType = {
  namespace: 'auth',
  state: {
    authlist: undefined,
    authbtnlist: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      let response = yield call(query);
      yield put({
        type: 'save',
        payload: { authlist: response },
      });
      response = yield call(queryBtn);
      yield put({
        type: 'save',
        payload: { authbtnlist: response },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default AuthModel;
