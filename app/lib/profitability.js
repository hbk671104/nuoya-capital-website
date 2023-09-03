export const calculate = ({
  strikePrice,
  quantity,
  tradePrice,
  assumedPrice,
}) => {
  const a = (assumedPrice - strikePrice - tradePrice) * quantity * 100
  const b = tradePrice * quantity * -100

  if (quantity > 0) {
    if (strikePrice < assumedPrice) {
      return a
    } else {
      return b
    }
  } else {
    if (strikePrice >= assumedPrice) {
      return b
    } else {
      return a
    }
  }
}
