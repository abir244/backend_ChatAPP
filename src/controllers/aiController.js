import { generateImageFromHF } from "../services/huggingfaceServices.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const imageBase64 = await generateImageFromHF(prompt);
    res.json({ image: imageBase64 });
  } catch (error) {
    console.error("AI Controller error:", error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
};
