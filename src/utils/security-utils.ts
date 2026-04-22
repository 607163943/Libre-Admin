import md5 from 'crypto-js/md5'

/**
 * 生成MD5哈希
 * @param str 字符串
 * @returns MD5哈希
 */
export const generateMD5 = (str: string): string => {
  return md5(str).toString()
}
