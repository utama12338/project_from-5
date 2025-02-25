// export const securityHeaders = {
//     'Content-Type': 'application/json',
//     'X-Content-Type-Options': 'nosniff',
//     'X-Frame-Options': 'DENY',
//     'X-XSS-Protection': '1; mode=block',
//     'Cache-Control': 'no-store, max-age=0',
//     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
//   } as const;
  
//   export function createSecureResponse(data: any, status: number) {
//     return new Response(JSON.stringify(data), {
//       status,
//       headers: securityHeaders
//     });
//   }

// //   ยังไม่ได้ใช้งาน don't use this yet