/**
 * Used to generate random positive integers of length, 6 by default, otherwise the passed in length, and expiration time for the code which by default is 15 minutes, otherwise the passed in expiration time.
 * @param length
 * @param exp
 * @returns random code and expiration time
 */

export function getRandomNumbers(length: number = 6, exp: number = 15) {
  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  //set code expiration
  const expiresAt = Date.now() + exp * 60 * 1000; // by default, code expires 15 minutes after it's generated.

  return { code: +code, expiresAt };
}
