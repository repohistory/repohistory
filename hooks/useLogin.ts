async function login(code: string) {
  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token?${new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      })}`,
      {
        headers: {
          Accept: 'application/json',
        },
        method: 'POST',
      },
    );
    const data = await response.json();
    if (data.error) {
      throw data.error;
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export default function useLogin() {
  return login;
}
