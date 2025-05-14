import { GeminiRequest, GeminiResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export async function sendChatMessage(
  request: GeminiRequest
): Promise<GeminiResponse> {
  try {
    const response = await apiRequest("POST", "/api/chat", request);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get response: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get response: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
  }
}
