import axios from "axios";

export const generateImageFromHF = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data).toString("base64");
  } catch (err) {
    console.error("HuggingFace error:", err.response?.data || err.message);
    throw new Error("Failed to generate image from Hugging Face");
  }
};
