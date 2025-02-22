export const formattedNumber = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number)
}
export const formattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
