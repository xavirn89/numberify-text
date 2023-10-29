type NumDictType = { [key: string]: number };

// Diccionario para números del 0 al 100, que son fáciles de representar.
const simpleNumDict: NumDictType = {
  "cero": 0, "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4,
  "cinco": 5, "seis": 6, "siete": 7, "ocho": 8, "nueve": 9,
  "diez": 10, "once": 11, "doce": 12, "trece": 13, "catorce": 14,
  "quince": 15, "veinte": 20, "treinta": 30, "cuarenta": 40,
  "cincuenta": 50, "sesenta": 60, "setenta": 70, "ochenta": 80,
  "noventa": 90, "cien": 100
}

// Diccionario para números complejos como cientos.
const complexNumDict: NumDictType = {
  "ciento": 100, "doscientos": 200, "trescientos": 300,
  "cuatrocientos": 400, "quinientos": 500, "seiscientos": 600,
  "setecientos": 700, "ochocientos": 800, "novecientos": 900
}  

// Diccionario para números especiales que no siguen la convención general.
const specialNumDict: NumDictType = {
  "dieciseis": 16, "diecisiete": 17, "dieciocho": 18, "diecinueve": 19,
  "veintiun":21, "veintiuno": 21, "veintidos": 22, "veintitres": 23, "veinticuatro": 24,
  "veinticinco": 25, "veintiseis": 26, "veintisiete": 27, "veintiocho": 28, "veintinueve": 29
};

// Diccionario para multiplicadores como "mil", "millón", etc.
const multiplierNumDict: NumDictType = {
  "mil": 1000, "millon": 1000000, "millones": 1000000, "billon": 1000000000, 
  "billones": 1000000000, "trillon": 1000000000000, "trillones": 1000000000000
}  

// Normaliza una cadena eliminando los diacríticos.
function normalizeString(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Procesa un array de palabras y convierte las palabras que representan números a su forma numérica.
function processWordsToNumbers(words: string[]): string[] {
  let output = []
  let prevWordIsNumber = false
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    let normalizedWord = normalizeString(word)
    let currentWordIsNumber = false

    if (simpleNumDict[normalizedWord]) {
      output.push(simpleNumDict[normalizedWord].toString())
      currentWordIsNumber = true
    } else if (complexNumDict[normalizedWord]) {
      output.push(complexNumDict[normalizedWord].toString())
      currentWordIsNumber = true
    } else if (specialNumDict[normalizedWord]) {
      output.push(specialNumDict[normalizedWord].toString())
      currentWordIsNumber = true
    } else if (word === "y" && prevWordIsNumber && i < words.length - 1) {
      const nextWord = normalizeString(words[i + 1])
      if (simpleNumDict[nextWord] || complexNumDict[nextWord] || specialNumDict[nextWord]) {
        continue
      } else {
        output.push(word)
      }
    } else {
      output.push(word)
    }

    prevWordIsNumber = currentWordIsNumber
  }

  return output
}

// Reemplaza "un" con "1" si la palabra siguiente es un multiplicador.
function replaceUnWithOneBeforeMultipliers(output: string[]): string[] {
  for (let i = 0; i < output.length - 1; i++) {
    if (normalizeString(output[i]) === "un" && multiplierNumDict[normalizeString(output[i + 1])]) {
      output[i] = "1"
    }
  }
  return output
}

// Aplica los multiplicadores a los números y los suma.
function applyMultipliersAndSum(output: string[]): string[] {
  let lastMultiplierValue = 1
  let lastMultiplierIndex = -1
  let tempSum = 0
  let tempNumbers = []
  
  for (let i = 0; i < output.length; i++) {
    let word = output[i]
    let normalizedWord = normalizeString(word)
  
    if (!isNaN(Number(word))) {
      tempSum += Number(word)
      tempNumbers.push(i)
      continue
    }
  
    if (multiplierNumDict[normalizedWord]) {
      if (tempSum === 0) {
        if (lastMultiplierValue > 1) {
          tempSum = lastMultiplierValue * multiplierNumDict[normalizedWord]
          output[lastMultiplierIndex] = ''
        } else {
          tempSum = multiplierNumDict[normalizedWord]
        }
      } else {
        tempSum *= multiplierNumDict[normalizedWord]
      }
  
      lastMultiplierValue = tempSum
      lastMultiplierIndex = i
      output[i] = tempSum.toString()
  
      for (const index of tempNumbers) {
        output[index] = ''
      }
  
      tempSum = 0
      tempNumbers = []
    } else {
      lastMultiplierValue = 1
      tempSum = 0
      tempNumbers = []
    }
  }
  return output
}

// Suma los números que se encuentran entre palabras.
function sumNumbersBetweenWords(output: string[]): string[] {
  let finalOutput = []
  let tempSum = 0
  
  for (let i = 0; i < output.length; i++) {
    let word = output[i]
  
    if (!isNaN(Number(word))) {
      tempSum += Number(word)
    } else {
      if (tempSum > 0) {
        finalOutput.push(tempSum.toString())
        tempSum = 0
      }
      finalOutput.push(word)
    }
  }
  
  if (tempSum > 0) {
    finalOutput.push(tempSum.toString())
  }
  
  return finalOutput
}

// Maneja números decimales en la cadena.
function handleDecimalNumbers(output: string[]): string[] {
  let newOutput = []
  let appendDecimal = false

  for (let i = 0; i < output.length; i++) {
    const word = output[i]

    if (appendDecimal) {
      if (!isNaN(Number(word))) {
        newOutput[newOutput.length - 1] += "," + word
        appendDecimal = false
      } else {
        newOutput.push(",")
        newOutput.push(word)
        appendDecimal = false
      }
    } else {
      if (normalizeString(word) === "coma") {
        appendDecimal = true
      } else {
        newOutput.push(word)
      }
    }
  }

  return newOutput
}  

// Función principal que toma una frase y la "numeraliza".
export function numberifyString_ES(sentence: string): string {
  const words = sentence.split(' ');
  
  let output = processWordsToNumbers(words)

  output = replaceUnWithOneBeforeMultipliers(output)

  output = applyMultipliersAndSum(output)
  
  output = sumNumbersBetweenWords(output)

  output = handleDecimalNumbers(output)

  return output.join(' ').trim()
}