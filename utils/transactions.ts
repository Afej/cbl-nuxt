import { TransactionType } from '~/common/types'

export const getAmountClass = (type: TransactionType) => {
  switch (type) {
    case TransactionType.Deposit:
    case TransactionType.Reversal:
      return 'text-green-600'
    case TransactionType.Withdrawal:
    case TransactionType.Transfer:
      return 'text-red-600'
    default:
      return ''
  }
}

export const getAmountPrefix = (type: TransactionType) => {
  switch (type) {
    case TransactionType.Deposit:
    case TransactionType.Reversal:
      return '+'
    case TransactionType.Withdrawal:
    case TransactionType.Transfer:
      return '-'
    default:
      return ''
  }
}
