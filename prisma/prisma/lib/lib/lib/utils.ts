export function titleFromPosting(postingNumber: string, article?: string) {
  const part = postingNumber.split('-')[0] || postingNumber
  const last4 = part.slice(-4)
  return `${last4} ${article ?? ''}`.trim()
}
