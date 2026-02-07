// Import the service functions
import {
    saveMessage as saveMessageService,
    getMessagesByRoom as getMessagesByRoomService
} from "../services/chatService.js";
// Export with exact names to match your imports
export const saveMessage = saveMessageService;
export const getMessagesByRoom = getMessagesByRoomService;
