
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length === 3) {
  // printList()
} else if (process.argv.length === 5) {
  // addContact()
} else if (process.argv.length < 5) {
  console.log('contact is incomplete, provide phone')
  process.exit(1)
} else {
  console.log('usage: node mongo.js password [name] [phone]')
}
