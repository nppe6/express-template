// 枚举状态码
enum Code {
  success = 3000,
  denied,
  error,
}

enum CodeMessage {
  success = 'Request succeeded',
  denied = 'Unauthorized',
  error = 'Request failed',
}

// 定义字面量类型 遍历Code 得出
type codeType = keyof typeof Code

export { Code, CodeMessage, codeType }
