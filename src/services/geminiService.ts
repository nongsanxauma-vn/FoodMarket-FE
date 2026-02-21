
// import { GoogleGenAI, Type } from "@google/genai";

// // Strictly follow the initialization guideline: Use named parameter and direct process.env.API_KEY access
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// export const generateProduceStory = async (productName: string) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: `Hãy viết một câu chuyện ngắn, truyền cảm hứng về nguồn gốc của nông sản tên là "${productName}". 
//       Tập trung vào sự mộc mạc, tâm huyết của người nông dân và tại sao mặc dù vẻ ngoài "xấu mã" nhưng chất lượng lại tuyệt vời. 
//       Văn phong ấm áp, gần gũi với thiên nhiên. Tối đa 150 từ.`,
//     });
//     return response.text;
//   } catch (error) {
//     console.error("Error generating produce story:", error);
//     return "Sản phẩm này mang trong mình tâm huyết của người nông dân, được nuôi dưỡng bởi nắng gió và đất mẹ. Dù vẻ ngoài không hoàn hảo, nhưng hương vị bên trong chính là kết tinh của sự tử tế.";
//   }
// };

// export const getRecipeSuggestions = async (ingredients: string[]) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: `Gợi ý 3 món ăn ngon sử dụng các nguyên liệu sau: ${ingredients.join(", ")}. 
//       Hãy tập trung vào các món ăn gia đình Việt Nam, tiết kiệm và bổ dưỡng.`,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               name: { type: Type.STRING },
//               description: { type: Type.STRING },
//               time: { type: Type.STRING },
//               difficulty: { type: Type.STRING }
//             }
//           }
//         }
//       }
//     });
//     return JSON.parse(response.text || '[]');
//   } catch (error) {
//     console.error("Error generating recipes:", error);
//     return [];
//   }
// };
