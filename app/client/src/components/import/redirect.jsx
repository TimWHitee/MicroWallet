export default async function RedirectRequest(
  data,
  url,
  navigatepath,
  navigate
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  console.log(response);
  response.ok
    ? navigate(navigatepath, { state: { walletData: await response.json() } })
    : navigate("/error", { state: { errorData: await response.json() } });
}
