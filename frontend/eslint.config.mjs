import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",  // ปิดการตรวจสอบตัวแปรที่ไม่ได้ใช้
      "no-unused-vars": "off",   // ปิดการตรวจสอบตัวแปรที่ไม่ได้ใช้ (สำหรับ JavaScript)
      // "no-unused-vars": "warn",
      // "no-console": "warn",
      // "no-undef": "error",
      // "react/prop-types": "off",
      // "react/jsx-key": "warn",
      "array-callback-return": "error",
      "no-unsafe-optional-chaining": "error",
      "array-callback-return": "error",
     
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error"
    }
  }
];

export default eslintConfig;
