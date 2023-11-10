async function login(code: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-access-token`,
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
