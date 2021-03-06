import { WrappedFormUtils } from 'antd/es/form/Form';
import { EffectsCommandMap } from 'dva';
import { History } from 'history';
import { AnyAction } from 'redux';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { AppModelState } from './app';
import { AuthModelState } from './auth';
import { GlobalModelState } from './global';
import { LoginState } from './login';
import { MenuModelState } from './menu';
import { UserModelState } from './user';

export { GlobalModelState, MenuModelState, SettingModelState, UserModelState };

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T },
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
  };
}

export interface ConnectState {
  app: AppModelState;
  auth: AuthModelState;
  settings: SettingModelState;
  global: GlobalModelState;
  loading: Loading;
  menu: MenuModelState;
  setting: SettingModelState;
  user: UserModelState;
  login: LoginState;
}

/**
 * @type T: Params matched in dynamic routing
 * @type R: Instance type of ref
 */
export interface ConnectProps<T extends { [key: string]: any } = {}, R = any>
  extends React.Props<R> {
  dispatch?: Dispatch;
  location?: Location;
  match?: {
    isExact: boolean;
    params: T;
    path: string;
    url: string;
  };
  loading?: Loading;
  history?: History;
}

export interface ConnectFormProps extends ConnectProps {
  form: WrappedFormUtils;
}

export default ConnectState;
