// Chat-only API configuration
const CHAT_WEBHOOK_URL = "http://10.3.132.85:5678/webhook/chat";

// Types for chat webhook
export interface ChatWebhookPayload {
  message: string;
  userId?: string;
  timestamp: string;
  sender: "user";
}

export interface ChatWebhookResponse {
  reply: string;
  timestamp: string;
}

// Simplified API service - chat only
class ChatApiService {
  // Chat webhook method
  async sendChatMessage(
    message: string,
    userId?: string
  ): Promise<ChatWebhookResponse> {
    try {
      console.log("🔵 API Service: sendChatMessage called");
      console.log("🔵 Webhook URL:", CHAT_WEBHOOK_URL);
      console.log("🔵 Message:", message);

      const payload: ChatWebhookPayload = {
        message,
        userId,
        timestamp: new Date().toISOString(),
        sender: "user",
      };

      console.log("🔵 Payload:", payload);
      console.log("🔵 About to make fetch request...");

      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("🔵 Fetch response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Chat webhook error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        reply:
          data.reply ||
          "Thank you for your message. I'm processing your request...",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chat webhook failed:", error);
      return {
        reply:
          "I apologize, but I'm having trouble connecting to the server right now. Please try again later.",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const chatApiService = new ChatApiService();
export default chatApiService;

