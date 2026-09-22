export const env = {
  // 编译期环境变量（可携带 /api/v1 前缀，client.ts 会归一化）；
  // 缺省为空字符串 = 同域部署走相对路径（见主题规范 3.2），禁止回退到 localhost
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? "15000"),
};
