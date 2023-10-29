# Numberify Text

Numberify Text is a JavaScript library that converts numbers written in text form to their numeric equivalents in various languages.

## Installation

\`\`\`bash
npm install numberify-text
\`\`\`

## Usage

### TypeScript / JavaScript

\`\`\`typescript
import { numberifyText } from 'numberify-text';

const sentence = "I have three apples and four oranges.";
const result = numberifyText(sentence, 'en');
console.log(result); // Output: "I have 3 apples and 4 oranges."
\`\`\`

### Supported Languages

- English (`en`)
- Spanish (`es`)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT]
