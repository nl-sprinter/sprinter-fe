import React, { useState, useEffect, useRef, useCallback } from 'react';
import RightSideModal from './RightSideModal';
import { getUserProjects } from '../../../api/userApi';
import { 
    getChatMessages, 
    getChatSubscriptionTopic,
    getChatSendDestination,
    getChatWebSocketEndpoint,
} from '../../../api/chatApi';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FiSend } from 'react-icons/fi';

const RightSideChatModal = ({ open, onClose }) => {
    console.log('[Chat] RightSideChatModal 렌더링, open=', open);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [user, setUser] = useState(null);
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const subscription = useRef(null);
    
    // 테스트용 더미 사용자 설정
    useEffect(() => {
        if (open) {
            setUser({
                id: 1,
                nickname: '테스트사용자'
            });
            console.log('[Chat] 더미 사용자 설정 완료');
        }
    }, [open]);
    
    // 프로젝트 목록 가져오기
    useEffect(() => {
        const fetchProjects = async () => {
            if (open) {
                setIsLoading(true);
                try {
                    const data = await getUserProjects();
                    console.log('[Chat] 프로젝트 목록:', data);
                    setProjects(data);
                    
                    if (data.length > 0 && !selectedProject) {
                        setSelectedProject(data[0]);
                    }
                } catch (error) {
                    console.error('[Chat] 프로젝트 목록 오류:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        if (open) {
            fetchProjects();
        }
    }, [open]);
    
    // 채팅 메시지 가져오기
    useEffect(() => {
        const fetchChatMessages = async () => {
            if (selectedProject) {
                try {
                    console.log(`[Chat] 채팅 메시지 요청: 프로젝트 ID ${selectedProject.projectId}`);
                    const data = await getChatMessages(selectedProject.projectId);
                    setMessages(data || []);
                } catch (error) {
                    console.error('[Chat] 채팅 메시지 오류:', error);
                    setMessages([]);
                }
            }
        };
        
        if (selectedProject) {
            fetchChatMessages();
        }
    }, [selectedProject]);
    
    // 웹소켓 연결 함수 - useCallback으로 메모이제이션
    const connectWebSocket = useCallback(() => {
        if (!selectedProject || !user) {
            console.log('[Chat] 연결 조건 미충족');
            return;
        }
        
        console.log('[Chat] 새 웹소켓 연결 시작');
        setIsConnecting(true);
        setConnectionError(null);
        
        // 기존 연결 정리
        if (subscription.current) {
            try {
                subscription.current.unsubscribe();
                subscription.current = null;
            } catch (e) {
                console.error('[Chat] 구독 해제 오류:', e);
            }
        }
        
        if (stompClient.current?.connected) {
            try {
                stompClient.current.deactivate();
                stompClient.current = null;
            } catch (e) {
                console.error('[Chat] STOMP 비활성화 오류:', e);
            }
        }
        
        try {
            const socketUrl = getChatWebSocketEndpoint();
            console.log(`[Chat] 인증 토큰이 포함된 소켓 URL: ${socketUrl}`);
            
            // 소켓 생성 (헤더 추가)
            socketRef.current = new SockJS(socketUrl);
            console.log('[Chat] SockJS 객체 생성됨');
            
            // STOMP 헤더에 인증 토큰 추가
            const headers = {};
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            // STOMP 클라이언트 생성
            stompClient.current = new Client({
                webSocketFactory: () => socketRef.current,
                connectHeaders: headers, // 인증 헤더 추가
                debug: (msg) => console.log('[STOMP]', msg),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });
            
            // 연결 이벤트 핸들러
            stompClient.current.onConnect = () => {
                console.log('[Chat] STOMP 연결 성공');
                setIsConnecting(false);
                
                // 채팅방 구독
                const topic = getChatSubscriptionTopic(selectedProject.projectId);
                console.log(`[Chat] 구독: ${topic}`);
                
                subscription.current = stompClient.current.subscribe(topic, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
                        console.log('[Chat] 메시지 수신:', msg);
                        setMessages(prev => [...prev, msg]);
                    } catch (error) {
                        console.error('[Chat] 메시지 파싱 오류:', error);
                    }
                });
            };
            
            // 오류 이벤트 핸들러
            stompClient.current.onStompError = (frame) => {
                console.error('[Chat] STOMP 오류:', frame);
                setIsConnecting(false);
                setConnectionError(`STOMP 오류: ${frame.headers.message}`);
            };
            
            stompClient.current.onWebSocketError = (error) => {
                console.error('[Chat] 웹소켓 오류:', error);
                setIsConnecting(false);
                setConnectionError('웹소켓 연결 실패');
            };
            
            // 연결 시작
            console.log('[Chat] STOMP 활성화 시작 (인증 헤더 포함)');
            stompClient.current.activate();
            
        } catch (error) {
            console.error('[Chat] 연결 초기화 오류:', error);
            setIsConnecting(false);
            setConnectionError(`초기화 오류: ${error.message}`);
        }
    }, [selectedProject, user]);
    
    // 모달 열릴 때와 프로젝트/사용자 변경 시 연결
    useEffect(() => {
        if (open && selectedProject && user) {
            console.log('[Chat] 연결 조건 충족됨, 연결 시작');
            connectWebSocket();
            
            // 모달 닫힐 때 정리
            return () => {
                console.log('[Chat] 모달 정리 함수');
                if (open) return; // 모달이 열려있을 때는 정리하지 않음
                
                if (subscription.current) {
                    console.log('[Chat] 구독 해제');
                    try {
                        subscription.current.unsubscribe();
                    } catch (e) {
                        console.error('[Chat] 구독 해제 오류:', e);
                    }
                    subscription.current = null;
                }
                
                if (stompClient.current) {
                    console.log('[Chat] STOMP 비활성화');
                    try {
                        stompClient.current.deactivate();
                    } catch (e) {
                        console.error('[Chat] STOMP 비활성화 오류:', e);
                    }
                    stompClient.current = null;
                }
                
                setIsConnecting(false);
            };
        }
    }, [open, connectWebSocket]);
    
    // 메시지 전송 함수
    const sendMessage = useCallback(() => {
        if (!messageText.trim() || !selectedProject || !user) {
            console.log('[Chat] 메시지 전송 조건 미충족');
            return;
        }
        
        if (!stompClient.current?.connected) {
            console.log('[Chat] STOMP 연결 안됨, 메시지 전송 불가');
            setConnectionError('연결이 끊어졌습니다. 다시 연결해주세요.');
            return;
        }

        const chatMessage = {
            projectId: selectedProject.projectId,
            userId: user.id,
            nickname: user.nickname,
            content: messageText
        }
        
        const destination = getChatSendDestination(selectedProject.projectId);
        console.log(`[Chat] 메시지 전송: ${destination}`, chatMessage);
        
        try {
            stompClient.current.publish({
                destination: destination,
                body: JSON.stringify(chatMessage)
            });
            console.log('[Chat] 메시지 전송 완료');
            setMessageText('');
        } catch (error) {
            console.error('[Chat] 메시지 전송 오류:', error);
            setConnectionError(`메시지 전송 오류: ${error.message}`);
        }
    }, [messageText, selectedProject, user]);
    
    // 프로젝트 변경 핸들러
    const handleProjectSelect = useCallback((project) => {
        console.log('[Chat] 프로젝트 변경:', project);
        setSelectedProject(project);
        setMessages([]);
        
        // 기존 연결이 있으면 새로운 채팅방으로 다시 연결
        if (stompClient.current?.connected) {
            if (subscription.current) {
                console.log('[Chat] 기존 구독 해제');
                try {
                    subscription.current.unsubscribe();
                    subscription.current = null;
                } catch (e) {
                    console.error('[Chat] 구독 해제 오류:', e);
                }
            }
            
            // 새 채팅방 구독
            try {
                const topic = getChatSubscriptionTopic(project.projectId);
                console.log(`[Chat] 새 채팅방 구독: ${topic}`);
                
                subscription.current = stompClient.current.subscribe(topic, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
                        console.log('[Chat] 메시지 수신:', msg);
                        setMessages(prev => [...prev, msg]);
                    } catch (error) {
                        console.error('[Chat] 메시지 파싱 오류:', error);
                    }
                });
            } catch (error) {
                console.error('[Chat] 채팅방 변경 오류:', error);
                // 오류 발생 시 완전히 새로 연결
                setTimeout(connectWebSocket, 100);
            }
        } else {
            // 연결이 없으면 새로 연결
            setTimeout(connectWebSocket, 100);
        }
    }, [connectWebSocket]);
    
    // Enter 키 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    // 수동 연결 핸들러
    const handleManualConnect = () => {
        console.log('[Chat] 수동 연결 시도');
        connectWebSocket();
    };
    
    // 시간 포맷팅
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        try {
            const date = new Date(timeString);
            return formatDistanceToNow(date, { addSuffix: true, locale: ko });
        } catch (error) {
            console.error('[Chat] 시간 포맷팅 오류:', error);
            return timeString;
        }
    };
    
    // 소켓 연결 상태
    const isSocketConnected = stompClient.current?.connected;
    
    // 스크롤 효과
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    return (
        <RightSideModal
            isOpen={open}
            onClose={() => {
                console.log('[Chat] 모달 닫기');
                onClose();
            }}
            title="채팅"
            contentLabel="Chat Modal"
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* 프로젝트 선택 영역 */}
                    <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-1">프로젝트 선택</div>
                        <div className="flex flex-wrap gap-2">
                            {projects.map((project) => (
                                <button
                                    key={project.projectId}
                                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                        selectedProject?.projectId === project.projectId
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => handleProjectSelect(project)}
                                >
                                    {project.projectName}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* 연결 상태 정보 */}
                    <div className="mb-3 p-2 bg-gray-100 rounded text-xs">
                        <div>연결 상태: {isSocketConnected ? '연결됨' : '연결되지 않음'}</div>
                        <div>선택된 프로젝트: {selectedProject?.projectName || '없음'}</div>
                        {connectionError && <div className="text-red-500">오류: {connectionError}</div>}
                        <button 
                            onClick={handleManualConnect}
                            className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                            {isConnecting ? '연결 중...' : '수동 연결 시도'}
                        </button>
                    </div>
                    
                    {/* 채팅 메시지 영역 */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3 mb-3 h-64">
                        {selectedProject ? (
                            messages.length > 0 ? (
                                <div className="space-y-3">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                                                    msg.userId === user?.id
                                                        ? 'bg-green-500 text-white rounded-tr-none'
                                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                                }`}
                                            >
                                                {msg.userId !== user?.id && (
                                                    <div className="text-xs font-medium text-gray-600 mb-1">
                                                        {msg.nickname}
                                                    </div>
                                                )}
                                                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                                <div
                                                    className={`text-xs ${
                                                        msg.userId === user?.id ? 'text-green-100' : 'text-gray-400'
                                                    } text-right mt-1`}
                                                >
                                                    {formatTime(msg.timeStamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    아직 대화가 없습니다. 새로운 메시지를 보내보세요!
                                </div>
                            )
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                채팅할 프로젝트를 선택해주세요.
                            </div>
                        )}
                    </div>
                    
                    {/* 메시지 입력 영역 */}
                    {selectedProject && (
                        <div className="flex gap-2">
                            <textarea
                                className="flex-1 min-h-10 max-h-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                placeholder={isSocketConnected ? "메시지를 입력하세요..." : "채팅 서버에 연결 중..."}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={!isSocketConnected}
                            />
                            <button
                                className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                                    isSocketConnected && messageText.trim()
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={sendMessage}
                                disabled={!isSocketConnected || !messageText.trim()}
                            >
                                <FiSend size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </RightSideModal>
    );
};

export default RightSideChatModal;