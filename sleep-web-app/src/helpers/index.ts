let token: null | string | any = null;

export const requestHandler = async (
  url: string,
  method?: string,
  body?: any
) => {
  if (!token) {
    const response: any = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "johndoe",
        password: "test123"
      })
    });

    const json = await response.json();

    token = json?.token;
  }

  const response = await fetch(url, {
    method: method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    body: JSON.stringify(body)
  });

  return response.json();
};
