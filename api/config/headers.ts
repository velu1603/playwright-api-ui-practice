
export const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

export const authHeaders = (token: string) => ({
  ...jsonHeaders,
  Cookie: `token=${token}`
})