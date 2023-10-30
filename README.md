# Numberify-Text

Numberify Text is a JavaScript library that converts numbers written in text form to their numeric equivalents in various languages.

## Installation

```
npm install numberify-text
```

## Usage

```
import { numberifyText } from 'numberify-text';
```

Then you can use the numberifyText method to convert the numbers written in text inside a string to their numeric equivalents.

```
const sentence = "I have three apples and four oranges in ten boxes";
const result = numberifyText(sentence, 'en');

console.log(result); // Output: "I have 3 apples and 4 oranges in 10 boxes"
```

This library can handle numbers up to the billions, making it versatile for various applications.

```
const sentence = "there are three cats in two million seven hundred fifty thousand thirty-two houses";
const result = numberifyText(sentence, 'en');

console.log(result); // Output: "there are 3 cats in 2750032 houses"
```

## Supported Languages

- English (`en`)
- Spanish (`es`)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Creator

- Xavi Ramon [XaviRN](https://github.com/xavirn89) (https://github.com/xavirn89)

## License

[MIT]
