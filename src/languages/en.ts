// Dictionary that stores simple numbers in word form to their corresponding numeric value.
type NumDictType = { [key: string]: number };

// Dictionary for numbers from 0 to 100, which are straightforward to represent.
const simpleNumDict: NumDictType = {
  "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4,
  "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
  "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
  "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, 
  "twenty": 20, "thirty": 30, "forty": 40,
  "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80,
  "ninety": 90
}

// Dictionary for multipliers like "thousand", "million", etc., including "hundred".
const multiplierNumDict: NumDictType = {
  "hundred": 100, "hundreds": 100, "thousand": 1000, "thousands": 1000, "million": 1000000, 
  "millions": 1000000, "billion": 1000000000, "billions": 1000000000, "trillion": 1000000000000,
  "trillions": 1000000000000
}

// Normalizes a string by removing diacritics.
function normalizeString(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Handles hyphenated numbers like "thirty-two" and converts them to "thirty two".
function handleHyphenatedNumbers(words: string[]): string[] {
  return words.reduce((acc, word) => {
    if (word.match(/([a-zA-Z])-([a-zA-Z])/)) {
      return [...acc, ...word.split('-')];
    } else {
      return [...acc, word];
    }
  }, [] as string[]);
}

// Processes an array of words and converts words that represent numbers to their numeric form.
function processWordsToNumbers(words: string[]): string[] {
  let output = []
  for (let word of words) {
    let normalizedWord = normalizeString(word)
    if (simpleNumDict[normalizedWord]) {
      output.push(simpleNumDict[normalizedWord].toString())
    } else {
      output.push(word)
    }
  }
  return output
}

// Replaces "a" or "an" with "1" if the following word is a multiplier.
function replaceAorAnWithOneBeforeMultipliers(output: string[]): string[] {
  for (let i = 0; i < output.length - 1; i++) {
    if (normalizeString(output[i]) === "a" || normalizeString(output[i]) === "an") {
      if (multiplierNumDict[normalizeString(output[i + 1])]) {
        output[i] = "1"
      }
    }
  }
  return output
}



// Applies the multipliers to the numbers and sums them.
function applyMultipliersAndSum(output: string[]): string[] {
  const newOutput: string[] = [];

  let segmentSum = 0;
  let segmentLastSum = 0;
  let segmentLastMultiplier = 0;
  let fullSum = 0;

  for (let i = 0; i < output.length; i++) {
    let word = output[i];
    let normalizedWord = normalizeString(word);

    if (!isNaN(Number(word))) {
      segmentSum += Number(word);
    } else {
      if (multiplierNumDict[normalizedWord]) {
        if (segmentSum === 0 && segmentLastSum === 0) {
          segmentLastSum = 1 * multiplierNumDict[normalizedWord];
          segmentLastMultiplier = multiplierNumDict[normalizedWord];
        } else if (segmentSum !== 0 && segmentLastSum === 0) {
          segmentLastSum = segmentSum * multiplierNumDict[normalizedWord];
          segmentLastMultiplier = multiplierNumDict[normalizedWord];
          segmentSum = 0;
        } else if (segmentLastSum !== 0) {
          if (multiplierNumDict[normalizedWord] < segmentLastMultiplier) {
            fullSum += segmentLastSum;
            segmentLastSum = segmentSum * multiplierNumDict[normalizedWord];
            segmentSum = 0;
            segmentLastMultiplier = multiplierNumDict[normalizedWord];
          } else if (multiplierNumDict[normalizedWord] > segmentLastMultiplier) {
            segmentLastSum = (segmentSum + segmentLastSum) * multiplierNumDict[normalizedWord];
            fullSum += segmentLastSum;
            segmentSum = 0;
            segmentLastSum = 0;
            segmentLastMultiplier = 0;
          }
        }
      } else {
        if (fullSum !== 0 || segmentLastSum !== 0 || segmentSum !== 0) {
          fullSum += (segmentSum + segmentLastSum);
          newOutput.push(fullSum.toString());
          segmentSum = 0;
          segmentLastSum = 0;
          segmentLastMultiplier = 0;
          fullSum = 0;
        }
        newOutput.push(word);
      }
    }
  }

  if (fullSum !== 0 || segmentLastSum !== 0 || segmentSum !== 0) {
    fullSum += (segmentSum + segmentLastSum);
    newOutput.push(fullSum.toString());
  }

  return newOutput;
}

// Sums the numbers that are found between words.
function sumNumbersBetweenWords(output: string[]): string[] {
  let finalOutput = []
  let tempSum = 0
  
  for (let word of output) {
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

// Handles decimal numbers in the string, replacing "point" with "."
function handleDecimalNumbers(output: string[]): string[] {
  let newOutput = []
  let appendDecimal = false

  for (let i = 0; i < output.length; i++) {
    const word = output[i]

    if (appendDecimal) {
      if (!isNaN(Number(word))) {
        newOutput[newOutput.length - 1] += "." + word
        appendDecimal = false
      } else {
        newOutput.push(".")
        newOutput.push(word)
        appendDecimal = false
      }
    } else {
      if (normalizeString(word) === "point") {
        appendDecimal = true
      } else {
        newOutput.push(word)
      }
    }
  }

  return newOutput
}

// Main function that takes a sentence and "numberizes" it.
export function numberifyString_EN(sentence: string): string {
  const words = sentence.split(' ')
  
  let output = handleHyphenatedNumbers(words)
  output = processWordsToNumbers(output)
  output = replaceAorAnWithOneBeforeMultipliers(output)
  output = applyMultipliersAndSum(output)
  output = sumNumbersBetweenWords(output)
  output = handleDecimalNumbers(output)
  
  return output.join(' ').trim()
}


