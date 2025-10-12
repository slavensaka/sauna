// Map

// Approved characters 
export const approvedChar = {
  start: '@',
  end: 'x',
  horizontal_line: '-',
  vertical_line: '|',
  spin: '+',
  space: ' ',
  letter: /^[A-Z]$/ // real regex
} as const;


// If approved_char is expanded with more const it will work (true or false)
export function isApprovedChar(char: string): boolean {
  for (const key in approvedChar) {
    const value = approvedChar[key as keyof typeof approvedChar];

    if (value instanceof RegExp) {
      if (value.test(char)) return true;
    } else if (value === char) {
      return true;
    }
  }
  return false;
}