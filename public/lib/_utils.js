export function kebabToCamel (input) {
  return input.toLowerCase()
    .split('-')
    .map((letters, i) => {
      return i > 0 ? letters.charAt(0).toUpperCase() + letters.slice(1) : letters
    })
    .join('')
}
