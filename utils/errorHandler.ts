export const getErrorMessage = (error: any, fallback?: string): string => {
  const errorMessage = error?.response?.data?.message

  if (Array.isArray(errorMessage)) {
    return errorMessage[0] || fallback || 'An unexpected error occurred'
  }

  return (
    errorMessage || error?.message || fallback || 'An unexpected error occurred'
  )
}

export default getErrorMessage
