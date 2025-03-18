import axiosInstance from './axiosInstance';
import SockJS from "sockjs-client";

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

// WebSocket 끝점 URL 반환
export const getChatWebSocketEndpoint = () => {
    console.log('[API] chatApi.getChatWebSocketEndpoint 호출');
    const endpoint = `http://localhost:8080/api/v1/chat/ws`;
    return endpoint;
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


// 추가: WebSocket 연결 상태 테스트를 위한 함수
export const testWebSocketConnection = (url = null) => {
    console.log('[API] chatApi.testWebSocketConnection 호출');
    const socketUrl = url || getChatWebSocketEndpoint();
    console.log(`[API] 테스트할 웹소켓 URL: ${socketUrl}`);
    
    try {
        console.log('[API] SockJS 객체 생성 시도...');
        const socket = new SockJS(socketUrl);
        
        socket.onopen = () => {
            console.log('[API] 웹소켓 테스트 연결 성공!');
            socket.close();
        };
        
        socket.onerror = (error) => {
            console.error('[API] 웹소켓 테스트 연결 오류:', error);
        };
        
        socket.onclose = (event) => {
            console.log('[API] 웹소켓 테스트 연결 종료:', event);
        };
        
        return true;
    } catch (error) {
        console.error('[API] 웹소켓 테스트 중 예외 발생:', error);
        return false;
    }
};