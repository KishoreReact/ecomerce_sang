import api from './api';

export const loginService = async ({ email, password, entityId }) => {
  try {
    // Match backend payload
    const response = await api.post('/login/login', {
      loginName: email,
      password: password,
      entityId: entityId,
      channelId: 1,
    });

    const data = response.data;

    if (data.status !== 'Success') {
      throw new Error(data.message || 'Login failed');
    }

    const result = data.result;
console.log("result123",result);

    // Save tokens & userdata to localStorage
    localStorage.setItem('userData', result.userData);
    localStorage.setItem('accessToken', result.accessToken.replace(/"/g, ''));
    localStorage.setItem('refreshToken', result.refreshToken.replace(/"/g, ''));
    localStorage.setItem('tokenExpiryMin', result.tokenExpiryMin);

    return result; // return result to Redux
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
