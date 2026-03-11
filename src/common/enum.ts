export enum QUEUE_NAME {
  ANALYSIS_SESSION = 'analysis-session-queue',
  CHAT_MESSAGE = 'chat-message-queue',
}

export enum EVENT_NAME {
  START_CHAT = 'start_chat',
  JOINED_CONVERSATION = 'joined_conversation',
  CHAT_ANALYSIS_RESPONSE = 'chat_analysis_response',
  ANALYSIS_SESSION_COMPLETE = 'analysis_session_complete',
  CHAT_ANALYSIS_PROGRESS = 'chat_analysis_progress',
}

export enum GeminiModel {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_0_FLASH = 'gemini-2.0-flash',
  GEMINI_2_0_FLASH_001 = 'gemini-2.0-flash-001',
  GEMINI_2_0_FLASH_EXP_IMAGE_GENERATION = 'gemini-2.0-flash-exp-image-generation',
  GEMINI_2_0_FLASH_LITE_001 = 'gemini-2.0-flash-lite-001',
  GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite',
  GEMINI_EXP_1206 = 'gemini-exp-1206',
  GEMINI_2_5_FLASH_PREVIEW_TTS = 'gemini-2.5-flash-preview-tts',
  GEMINI_2_5_PRO_PREVIEW_TTS = 'gemini-2.5-pro-preview-tts',
  GEMMA_3_1B_IT = 'gemma-3-1b-it',
  GEMMA_3_4B_IT = 'gemma-3-4b-it',
  GEMMA_3_12B_IT = 'gemma-3-12b-it',
  GEMMA_3_27B_IT = 'gemma-3-27b-it',
  GEMMA_3N_E4B_IT = 'gemma-3n-e4b-it',
  GEMMA_3N_E2B_IT = 'gemma-3n-e2b-it',
  GEMINI_FLASH_LATEST = 'gemini-flash-latest',
  GEMINI_FLASH_LITE_LATEST = 'gemini-flash-lite-latest',
  GEMINI_PRO_LATEST = 'gemini-pro-latest',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite',
  GEMINI_2_5_FLASH_IMAGE = 'gemini-2.5-flash-image',
  GEMINI_2_5_FLASH_PREVIEW_09_2025 = 'gemini-2.5-flash-preview-09-2025',
  GEMINI_2_5_FLASH_LITE_PREVIEW_09_2025 = 'gemini-2.5-flash-lite-preview-09-2025',
  GEMINI_3_PRO_PREVIEW = 'gemini-3-pro-preview',
  GEMINI_3_FLASH_PREVIEW = 'gemini-3-flash-preview',
  GEMINI_3_PRO_IMAGE_PREVIEW = 'gemini-3-pro-image-preview',
  NANO_BANANA_PRO_PREVIEW = 'nano-banana-pro-preview',
  GEMINI_ROBOTICS_ER_1_5_PREVIEW = 'gemini-robotics-er-1.5-preview',
  GEMINI_2_5_COMPUTER_USE_PREVIEW_10_2025 = 'gemini-2.5-computer-use-preview-10-2025',
  DEEP_RESEARCH_PRO_PREVIEW_12_2025 = 'deep-research-pro-preview-12-2025',
}

export const MAPPED_CHAT_MESSAGE_ROLE = {
  user: 'user',
  assistant: 'model',
};

export enum LogAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  LOGIN_GOOGLE = 'login_google',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  CREATE_ANALYSIS_SESSION = 'create_analysis_session',
  DELETE_ANALYSIS_SESSION = 'delete_analysis_session',
  CREATE_CHAT_MESSAGE = 'create_chat_message',
  UPDATE_PROFILES = 'update_profiles',
  REFINE_ANALYSIS_SESSION = 'refine_analysis_session',
  UPDATE_ANALYSIS_SESSION = 'update_analysis_session',
  UPDATE_CHAT_MESSAGE = 'update_chat_message',
}

export enum LogEntityType {
  USER = 'User',
  ANALYSIS_SESSION = 'AnalysisSession',
  CHAT_MESSAGE = 'ChatMessage',
}
