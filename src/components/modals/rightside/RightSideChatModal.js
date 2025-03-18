import React, {useState, useEffect, useRef, useCallback} from 'react';
import RightSideModal from './RightSideModal';
import {getUserProjects} from '../../../api/userApi';
import {
    getChatMessages,
    getPagedChatMessages,
    getChatSubscriptionTopic,
    getChatSendDestination,
    getChatWebSocketEndpoint,
} from '../../../api/chatApi';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {FiSend, FiGlobe, FiChevronUp} from 'react-icons/fi';
import {useUserStore} from "../../../store/useUserStore";
import ChatBubble from '../../common/ChatBubble';
import ProjectDropdown from '../../common/ProjectDropdown';
import SmallInfoModal from '../info/SmallInfoModal';

const RightSideChatModal = ({open, onClose}) => {
    const {user} = useUserStore();

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [showReconnectModal, setShowReconnectModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    
    const PAGE_SIZE = 20;

    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const subscription = useRef(null);
    const scrollPositionRef = useRef(null);
    const chatContainerRef = useRef(null);

    // 프로젝트 목록 가져오기
    useEffect(() => {
        const fetchProjects = async () => {
            if (open) {
                setIsLoading(true);
                try {
                    const data = await getUserProjects();
                    setProjects(data);

                    if (data.length > 0 && !selectedProject) {
                        setSelectedProject(data[0]);
                    }
                } catch (error) {
                    console.error('RightSideChatModal.fetchProject 에러:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        if (open) {
            fetchProjects();
        }
    }, [open]);

    // 선택된 프로젝트의 채팅 메시지 페이지네이션 조회
    useEffect(() => {
        const fetchPagedChatMessages = async () => {
            if (selectedProject) {
                setIsLoading(true);
                try {
                    const data = await getPagedChatMessages(selectedProject.projectId, 0, PAGE_SIZE);
                    // 시간순으로 정렬 (오래된 메시지가 먼저 표시되도록)
                    const sortedData = sortMessagesByTime(data || []);
                    setMessages(sortedData);
                    setCurrentPage(0);
                    setHasMoreMessages(data.length === PAGE_SIZE);
                } catch (error) {
                    console.error('RightSideChatModal.fetchPagedChatMessages 에러:', error);
                    setMessages([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (selectedProject) {
            fetchPagedChatMessages();
        }
    }, [selectedProject]);

    // 더 많은 메시지 로드 함수
    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMoreMessages || !selectedProject) return;
        
        setIsLoadingMore(true);
        
        try {
            // 스크롤 위치 저장
            if (chatContainerRef.current) {
                scrollPositionRef.current = chatContainerRef.current.scrollHeight;
            }
            
            const nextPage = currentPage + 1;
            const olderMessages = await getPagedChatMessages(selectedProject.projectId, nextPage, PAGE_SIZE);
            
            if (olderMessages.length > 0) {
                // 시간순으로 정렬하여 기존 메시지와 합친 후 다시 정렬
                const allMessages = sortMessagesByTime([...olderMessages, ...messages]);
                
                setMessages(allMessages);
                setCurrentPage(nextPage);
                setHasMoreMessages(olderMessages.length === PAGE_SIZE);
            } else {
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('RightSideChatModal.loadMoreMessages 에러:', error);
        } finally {
            setIsLoadingMore(false);
            
            // 스크롤 위치 복원
            setTimeout(() => {
                if (chatContainerRef.current && scrollPositionRef.current) {
                    const newScrollTop = chatContainerRef.current.scrollHeight - scrollPositionRef.current;
                    chatContainerRef.current.scrollTop = newScrollTop;
                }
            }, 100);
        }
    };

    // 메시지를 시간순으로 정렬하는 함수
    const sortMessagesByTime = (messageArray) => {
        return [...messageArray].sort((a, b) => {
            // timeStamp가 문자열인 경우 날짜 객체로 변환하여 비교
            const dateA = new Date(a.timeStamp);
            const dateB = new Date(b.timeStamp);
            return dateA - dateB; // 오름차순 정렬 (과거 → 현재)
        });
    };

    // 웹소켓 연결 함수 - useCallback으로 메모이제이션
    const connectWebSocket = useCallback(() => {
        if (!selectedProject || !user) {
            console.log('RightSideChatModal.connectWebSocket 에러: selectedProject 나 user 가 없음.');
            return;
        }
        setConnectionError(null);

        // 기존 구독 정리
        if (subscription.current) {
            try {
                subscription.current.unsubscribe();
                subscription.current = null;
            } catch (error) {
                console.error('RightSideChatModal.connectWebSocket 에러: 구독 해제 안됨.', error);
            }
        }

        if (stompClient.current?.connected) {
            try {
                stompClient.current.deactivate();
                stompClient.current = null;
            } catch (error) {
                console.error('RightSideChatModal.connectWebSocket 에러: STOMP 비활성화 안됨.', error);
            }
        }

        try {
            const socketUrl = getChatWebSocketEndpoint();
            // 소켓 생성 (헤더 추가)
            socketRef.current = new SockJS(socketUrl);

            // STOMP 헤더에 인증 토큰 추가
            const headers = {};
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // STOMP 클라이언트 생성
            stompClient.current = new Client({
                webSocketFactory: () => socketRef.current,
                connectHeaders: headers,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            // 연결 이벤트 핸들러
            stompClient.current.onConnect = () => {
                // 채팅방 구독
                const topic = getChatSubscriptionTopic(selectedProject.projectId);
                subscription.current = stompClient.current.subscribe(topic, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
                        // 새 메시지는 항상 가장 마지막에 추가 (시간순 유지)
                        setMessages(prev => [...prev, msg]);
                    } catch (error) {
                        console.error('RightSideChatModal.connectWebSocket 에러: 메세지 파싱 에러', error);
                    }
                });
            };

            // 오류 이벤트 핸들러
            stompClient.current.onStompError = (frame) => {
                console.error('RightSideChatModal.connectWebSocket 에러: STOMP 에러, ', frame);
                setConnectionError(`STOMP 오류: ${frame.headers.message}`);
            };

            stompClient.current.onWebSocketError = (error) => {
                console.error('RightSideChatModal.connectWebSocket 에러: 웹 소켓 에러, ', error);
                setConnectionError('웹소켓 연결 실패');
            };

            // 연결 시작
            stompClient.current.activate();

        } catch (error) {
            console.error('RightSideChatModal.connectWebSocket 에러: 연결 초기화 에러', error);
            setConnectionError(`초기화 에러: ${error.message}`);
        }
    }, [selectedProject, user]);

    // 모달 열릴 때와 프로젝트/사용자 변경 시 연결
    useEffect(() => {
        if (open && selectedProject && user) {
            connectWebSocket();

            // 모달 닫힐 때 정리
            return () => {
                if (open) return;

                if (subscription.current) {
                    try {
                        subscription.current.unsubscribe();
                    } catch (error) {
                        console.error('RightSideChatModal 에러: 구독 해제 에러', error);
                    }
                    subscription.current = null;
                }

                if (stompClient.current) {
                    try {
                        stompClient.current.deactivate();
                    } catch (e) {
                        console.error('RightSideChatModal 에러: STOMP 비활성화 에러', e);
                    }
                    stompClient.current = null;
                }
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
            userId: user.userId,
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
            setMessageText('');
        } catch (error) {
            console.error('[Chat] 메시지 전송 오류:', error);
            setConnectionError(`메시지 전송 오류: ${error.message}`);
        }
    }, [messageText, selectedProject, user]);

    // 프로젝트 변경 핸들러
    const handleProjectSelect = useCallback((project) => {
        setSelectedProject(project);
        setMessages([]);
        setCurrentPage(0);
        setHasMoreMessages(true);

        // 기존 연결이 있으면 새로운 채팅방으로 다시 연결
        if (stompClient.current?.connected) {
            if (subscription.current) {
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

                subscription.current = stompClient.current.subscribe(topic, (message) => {
                    try {
                        const msg = JSON.parse(message.body);
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

    // 재연결 핸들러
    const handleReconnect = () => {
        console.log('RightSideChatModal.handleReconnect');
        setShowReconnectModal(true);
        setTimeout(() => {
            connectWebSocket();
            setShowReconnectModal(false);
        }, 1500);
    };

    // 초기 로딩 시 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (messages.length > 0 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [selectedProject]);

    // 새 메시지 추가 시 스크롤 조정 (마지막 메시지가 추가될 때만)
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            // 새로운 메시지가 추가되면 스크롤을 아래로 이동
            messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
        }
    }, [messages.length]);

    // 소켓 연결 상태
    const isSocketConnected = stompClient.current?.connected;

    return (
        <>
        <RightSideModal
            isOpen={open}
            onClose={() => {
                onClose();
            }}
            title="채팅"
            contentLabel="Chat Modal"
            extraHeaderContent={
                <button
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors mr-2"
                    onClick={handleReconnect}
                    title="채팅 서버 재연결"
                >
                    <FiGlobe size={18}/>
                </button>
            }
        >
            {isLoading && !messages.length ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* 프로젝트 선택 드롭다운 */}
                    <div className="mb-3">
                        <ProjectDropdown
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelect={handleProjectSelect}
                        />
                    </div>

                    {/* 연결 상태 정보 */}
                    {connectionError && (
                        <div className="mb-3 p-2 bg-red-50 rounded text-xs text-red-500">
                            오류: {connectionError}
                        </div>
                    )}

                    {/* 채팅 메시지 영역 - 스크롤바 포함 */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto bg-blue-50 rounded-lg p-3 mb-3 border border-gray-200 relative"
                        style={{
                            height: '400px',
                            maxHeight: 'calc(100vh - 200px)',
                            overflowX: 'hidden'
                        }}
                    >
                        {/* 더 보기 버튼 */}
                        {hasMoreMessages && messages.length > 0 && (
                            <div className="sticky top-0 left-0 w-full flex justify-center py-1 z-10">
                                <button
                                    className={`flex items-center gap-1 px-3 py-1 bg-white shadow-md rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors ${isLoadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={loadMoreMessages}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-1"></div>
                                    ) : (
                                        <FiChevronUp size={14} />
                                    )}
                                    이전 메시지 더 보기
                                </button>
                            </div>
                        )}
                        
                        {/* 메시지 목록 */}
                        {messages.length > 0 ? (
                            <div>
                                {messages.map((msg, idx) => (
                                    <ChatBubble
                                        key={`${msg.id || idx}-${msg.timeStamp}`}
                                        message={msg}
                                        isCurrentUser={msg.userId === user?.userId}
                                    />
                                ))}
                                <div ref={messagesEndRef}/>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                아직 대화가 없습니다. 새로운 메시지를 보내보세요!
                            </div>
                        )}
                    </div>

                    {/* 메시지 입력 영역 (텍스트박스와 버튼을 하나의 박스로) */}
                    {selectedProject && (
                        <div className="mt-auto border border-gray-300 rounded-lg overflow-hidden flex">
                            <textarea
                                className="flex-1 min-h-10 max-h-12 px-3 py-2 border-0 focus:ring-0 resize-none outline-none"
                                placeholder={isSocketConnected ? "메시지를 입력하세요." : "채팅 서버에 연결 중..."}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                disabled={!isSocketConnected}
                            />
                            <button
                                className={`px-4 h-auto flex items-center justify-center ${
                                    isSocketConnected && messageText.trim()
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={sendMessage}
                                disabled={!isSocketConnected || !messageText.trim()}
                            >
                                <FiSend size={18}/>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </RightSideModal>

        {/* 재연결 알림 모달 */}
        <SmallInfoModal
            isOpen={showReconnectModal}
            onClose={() => setShowReconnectModal(false)}
            title="재연결"
            message="채팅 서버에 재연결합니다."
            type="success"
        />
        </>
    );
};

export default RightSideChatModal;