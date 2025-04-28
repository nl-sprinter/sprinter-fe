import axiosInstance from './axiosInstance';

/**
 * 채팅 API 명세서
 * 1. WebSocket 연결
 * - GET /api/v1/chat/ws (SocketJS와 STOMP 프로토콜 사용)
 *
 * 2. 채팅 메세지 송수신
 * 2-1. 구독 (메세지 수신)
 * - SUBSCRIBE /topic/room/{projectId}
 * 요청 본문(JSON)
 * {
 *     "projectId":{projectId} (Long)
 *     "userId":{userId} (Long)
 *     "nickname":{nickname} (String)
 *     "content":{content} (String)
 * }
 * 2-2. 메세지 전송
 * - SEND /app/room/{projectId}
 * 응답 본문(JSON): 구독자에게 전달되는 메시지
 * {
 *     "projectId":{projectId} (Long)
 *     "userId":{userId} (Long)
 *     "nickname":{nickname} (String)
 *     "content":{content} (String)
 *     "timeStamp":{timeStamp} (String "yyyy-MM-dd HH:mm:ss" 형식으로 서버에서 가공해서 줌)
 * }
 * 3. REST API
 * 3-1. 프로젝트 단체 채팅방의 채팅 메시지 전체 조회
 * - GET /api/v1/chat/room/{projectId}/messages
 * 3-2. 프로젝트 단체 채팅방의 채팅 메시지 페이지네이션 조회
 * - GET /api/v1/chat/room/{projectId}/messages/paged?page={page}&size={size}
 * */

// WebSocket 엔드포인트 URL 반환
export const getChatWebSocketEndpoint = () => {
    console.log('[API] chatApi.getChatWebSocketEndpoint 호출');
    return process.env.REACT_APP_WS_BASE_URL || '/api/v1/chat/ws';
};

// 프로젝트 채팅방의 모든 메시지 조회
export const getChatMessages = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/chat/room/${projectId}/messages`);
        console.log(`[API] chatApi.getChatMessages 응답 성공, 데이터 개수:`, response.data?.length || 0);
        return response.data;
    } catch (error) {
        console.error(`[API] chatApi.getChatMessages 에러, projectId=${projectId}:`, error);
        throw error;
    }
};

// 프로젝트 채팅방의 메시지 페이지네이션 조회
export const getPagedChatMessages = async (projectId, page = 0, size = 20) => {
    try {
        console.log(`[API] chatApi.getPagedChatMessages - 요청 URL: /chat/room/${projectId}/messages/paged?page=${page}&size=${size}`);
        const response = await axiosInstance.get(`/chat/room/${projectId}/messages/paged`, {
            params: { page, size }
        });
        console.log(`[API] chatApi.getPagedChatMessages 응답 성공:`, response.data);
        const content = response.data.content || [];
        console.log(`[API] 페이지 데이터 개수:`, content.length);
        return content;
    } catch (error) {
        console.error(`[API] chatApi.getPagedChatMessages 에러, projectId=${projectId}:`, error);
        console.error(`[API] 오류 상세:`, error.response?.data || error.message);
        throw error;
    }
};

// 구독 주제 URL 생성
export const getChatSubscriptionTopic = (projectId) => {
    return `/topic/room/${projectId}`;
};

// 메시지 전송 주소 생성
export const getChatSendDestination = (projectId) => {
        return `/app/room/${projectId}`;
};
