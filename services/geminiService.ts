import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDishDescription = async (dishName: string, ingredients?: string): Promise<string> => {
  try {
    const prompt = `Viết một mô tả ngắn gọn, hấp dẫn và ngon miệng (khoảng 30-50 từ) cho món ăn có tên: "${dishName}"${ingredients ? ` với thành phần chính là: ${ingredients}` : ''}. Mô tả bằng tiếng Việt, tập trung vào hương vị để thu hút khách hàng gọi món.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Món ăn tuyệt ngon đang chờ bạn thưởng thức.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Món ăn đặc biệt của nhà hàng.";
  }
};
