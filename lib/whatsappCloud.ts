// export async function sendWhatsAppMessage(to: string, text: string) {
//   const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
//   const accessToken = process.env.WA_ACCESS_TOKEN;
//   if (!phoneNumberId || !accessToken) return;
//
//   try {
//     await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messaging_product: 'whatsapp',
//         to,
//         type: 'text',
//         text: { body: text },
//       }),
//     });
//   } catch (error) {
//     console.error('WhatsApp Cloud API Error:', error);
//   }
// }
