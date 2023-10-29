import { numberifyString_ES } from './languages/es'
import { numberifyString_EN } from './languages/en'

export function numberifyText(sentence: string, language: string): string {
  switch (language) {
    case 'es':
      return numberifyString_ES(sentence);
    case 'en':
      return numberifyString_EN(sentence);
    default:
      return sentence;
  }
}