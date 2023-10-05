async function login(code: string) {
  try {
    const response = await fetch(
      'http://localhost:3000/api/get-access-token',
      {
        headers: {
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ code })
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
