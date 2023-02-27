import JSEncrypt from 'jsencrypt'

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKgWZvTInkhjJW2biT5BmrruN5uPKc1q\n' +
  'yjYntIoQE8Ov9XvRBhLRXG0EAoapqWugnB416f44QRzGHEC1x333PrECAwEAAQ=='

const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAqBZm9MieSGMlbZuJ\n' +
  'PkGauu43m48pzWrKNie0ihATw6/1e9EGEtFcbQQChqmpa6CcHjXp/jhBHMYcQLXH\n' +
  'ffc+sQIDAQABAkBzPOCbI8u4rxii+8ZtA0dUrys6oD01kuhNlo0lNn6GYsik87vC\n' +
  'cHPfuvSuLI3Nmf9uf0n12tGpafqfRbjfQEJdAiEA2oq9Y+CcvRftBbBadcaxaehE\n' +
  '+AtrUxeitB5MB5RoJKMCIQDE5c38yZFFCoO5d7o7VFkpDrhnrAUpkgCzzCYp4fOw\n' +
  'mwIgMkr/br7AE1wwNcDx8Gy7Y24KgTLPjh3AWccnJA9pMBUCIAOUynJWmDXRQyQU\n' +
  'cWay2gxNID2Ce3WOGkUq6WbJnU0RAiAW+VrUZAh6vJyXbOR09xGHuGNmMm7TgkSK\n' +
  'kC3xoIhA/A=='

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

