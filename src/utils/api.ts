export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('businessId')
    window.location.href = '/login'
    return res
  }

  return res
}