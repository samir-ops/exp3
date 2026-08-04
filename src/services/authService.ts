const base64UrlEncode = (str: string) => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMockJWT = (payload: object) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode('mock_signature');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const loginUser = async (username: string, password: string): Promise<{ token: string, user: any }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (username === 'admin' && password === 'admin') {
    const user = { id: '1', username: 'admin', role: 'admin' };
    const token = createMockJWT({
      ...user,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    });
    return { token, user };
  }
  throw new Error('Invalid credentials');
};

export const decodeMockJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};
