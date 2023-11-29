export const responseOrError = async (response: any) => {
  if (response.ok) return response.json();
  else {
    const errors = await readErrors(response);
    throw new Error(errors);
  }
};

export async function readErrors(rawResponse: any) {
  if (rawResponse.status === 401) {
    throw new Error(rawResponse.status);
  }
  const response = await rawResponse.json();

  if (response.error) {
    return response.error;
  } else if (response.errors) {
    const message = response.errors.join('\n');
    return message;
  }
}
