const fs = require('fs')

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomNumbersToFile() {
  const timestamp = Date.now()
  const fileName = `random-${timestamp}.txt`
  const filePath = `./${fileName}`
  const stream = fs.createWriteStream(filePath)

  for (let i = 0; i < 20; i++) {
    const randomNumber = generateRandomNumber(-420, 2137)
    const line = `${randomNumber}\n`
    stream.write(line)
  }
  stream.end()
}
generateRandomNumbersToFile();