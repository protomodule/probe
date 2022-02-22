import base from "base-x"

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const coder = base(ALPHABET)

export const decode = (base58: string) => {
  return Buffer.from(coder.decode(base58))
}

export const encode = (buffer: Buffer) => {
  return coder.encode(buffer)
}
