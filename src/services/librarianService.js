
import apiClient from "@/api/apiClient";

export const askLibrarian = async ({ message, conversationId, safeMode }) => {
  const response = await apiClient.post("/librarian/chat", {
    message,
    conversationId,
    safe_mode: safeMode,
  });

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message || "The Librarian could not answer right now."
    );
  }

  return response.data.data;
};
