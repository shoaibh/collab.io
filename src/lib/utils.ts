import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGibberishEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomString = (length: number) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const email = `${randomString(8)}@${randomString(5)}.${randomString(3)}`;
  return email;
}

export function generatePassword() {
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  const allChars = lowerCaseChars + upperCaseChars + numbers + symbols;

  const getRandomChar = (chars: string) => chars.charAt(Math.floor(Math.random() * chars.length));

  const password = [
    getRandomChar(lowerCaseChars), // Ensure at least one lowercase
    getRandomChar(upperCaseChars), // Ensure at least one uppercase
    getRandomChar(numbers), // Ensure at least one number
    getRandomChar(symbols), // Ensure at least one symbol
  ];

  // Fill remaining characters with random ones from allChars
  for (let i = 4; i < 12; i++) {
    // A password of 12 characters length
    password.push(getRandomChar(allChars));
  }

  // Shuffle the password array and return it as a string
  return password.sort(() => Math.random() - 0.5).join("");
}
