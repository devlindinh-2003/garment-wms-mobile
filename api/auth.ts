import { get, post } from './ApiCaller';

let loginUrl = `/auth/sign-in`;
let refreshTokenUrl = `/auth/refresh-token`;
export const authApi = {
  login: (email: string, password: string, role: string) => {
    return post(loginUrl, { email, password, role });
  },
  refreshToken: (header: any) => {
    return get(refreshTokenUrl, {}, header);
  },
  confirmOtp: (id: string, otp: string, token: string) => {
    return post(
      `/Auth/confirm-otp`,
      { id: id, otp: otp },
      {},
      { Authorization: token }
    );
  },
};
