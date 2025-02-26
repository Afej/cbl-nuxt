import { TransactionType, TransactionStatus } from '~/common/types'

export const getAmountClass = (amount: number) => {
  return amount >= 0 ? 'text-green-600' : 'text-red-600'
}

export const getTypeColor = (type: TransactionType) => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return 'green'
    case TransactionType.WITHDRAWAL:
      return 'red'
    case TransactionType.TRANSFER:
      return 'blue'
    case TransactionType.REVERSAL:
      return 'orange'
    default:
      return 'gray'
  }
}

export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return 'green'
    case TransactionStatus.REVERSED:
      return 'orange'
    case TransactionStatus.FAILED:
      return 'red'
    default:
      return 'gray'
  }
}
