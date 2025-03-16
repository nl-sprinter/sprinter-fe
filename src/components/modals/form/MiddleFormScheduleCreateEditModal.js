import { useState, useEffect } from 'react';
import MiddleFormModal from './MiddleFormModal';
import UserAttendanceContainer from "../../containers/UserAttendanceContainer";
import { getUsersInProject } from '../../../api/projectApi';
import { FiTrash2 } from 'react-icons/fi';

// 모던한 라디오 버튼 컴포넌트
const ModernRadioGroup = ({ options, value, onChange, name }) => {
    return (
        <div className="flex p-1 bg-gray-100 rounded-lg">
            {options.map(option => (
                <button
                    key={option.value}
                    type="button"
                    className={`
                        flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all
                        ${value === option.value 
                            ? 'bg-white text-green-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }
                    `}
                    onClick={() => onChange({ target: { name, value: option.value } })}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

const ColorPalette = ({ selectedColor, onSelectColor }) => {
    const colors = [
        { name: '빨간색', value: '#F87171' },  // red-400
        { name: '주황색', value: '#FB923C' },  // orange-400
        { name: '노란색', value: '#FBBF24' },  // amber-400
        { name: '초록색', value: '#4ADE80' },  // green-400
        { name: '파란색', value: '#60A5FA' },  // blue-400
        { name: '남색', value: '#818CF8' },    // indigo-400
        { name: '보라색', value: '#C084FC' },  // purple-400
    ];

    return (
        <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">일정 색상</p>
            <div className="flex space-x-3 items-center justify-center">
                {colors.map(color => (
                    <div 
                        key={color.value}
                        onClick={() => onSelectColor(color.value)}
                        className={`
                            w-8 h-8 rounded-full cursor-pointer transition-all
                            hover:scale-110 relative
                            ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    />
                ))}
            </div>
        </div>
    );
};

const MiddleFormScheduleCreateEditModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    projectId,
    schedule
}) => {
    const [projectUsers, setProjectUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '10:00',
        isAllDay: false,
        notifyBefore: false,
        notifyHours: 3,
        color: '#F87171',
    });

    // 데이터 로드
    useEffect(() => {
        if (isOpen) {
            // 프로젝트 유저 로드
            fetchProjectUsers();
            
            if (schedule) {
                // 기존 이벤트 데이터 로드
                setFormData({
                    title: schedule.title || '',
                    startDate: schedule.date || new Date().toISOString().split('T')[0],
                    startTime: schedule.startTime || '09:00',
                    endDate: schedule.endDate || schedule.date || new Date().toISOString().split('T')[0],
                    endTime: schedule.endTime || '10:00',
                    isAllDay: schedule.isAllDay || false,
                    notifyBefore: schedule.notifyBefore || false,
                    notifyHours: schedule.notifyHours || 3,
                    color: schedule.color || '#F87171',
                });
                
                setAssignedUsers(schedule.users || []);
            } else {
                setFormData({
                    title: '',
                    startDate: new Date().toISOString().split('T')[0],
                    startTime: '09:00',
                    endDate: new Date().toISOString().split('T')[0],
                    endTime: '10:00',
                    isAllDay: false,
                    notifyBefore: false,
                    notifyHours: 3,
                    color: '#F87171'
                });
                setAssignedUsers([]);
            }
        }
    }, [isOpen, schedule, projectId]);

    // 프로젝트 유저 로드 수정
    const fetchProjectUsers = async () => {
        if (!projectId) return;

        try {
            const users = await getUsersInProject(projectId);
            setProjectUsers(users);

        } catch (error) {
            console.error('프로젝트 유저 로드 실패:', error);
            setProjectUsers([]);
        }
    };
    
    // 알림 시간 입력 처리
    const handleNotifyHoursChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        if (value >= 0 && value <= 72) {
            setFormData(prev => ({ ...prev, notifyHours: value }));
        }
    };
    
    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // 체크박스/라디오 변경 처리
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };
    
    // 색상 선택 처리
    const handleColorSelect = (color) => {
        setFormData(prev => ({ ...prev, color }));
    };

    // 사용자 할당 처리 수정
    const handleUserToggle = (user) => {
        // 현재 assignedUsers 상태에 사용자 추가
        if (!assignedUsers.some(u => u.userId === user.userId)) {
            setAssignedUsers(prev => [...prev, user]);
        }
    };

    const handleUserRemove = (user) => {
        // 현재 assignedUsers 상태에서 사용자 제거
        setAssignedUsers(prev => prev.filter(u => u.userId !== user.userId));
    };
    
    // 폼 제출 처리 수정
    const handleSubmit = () => {
        // 날짜 및 시간 포맷팅
        const startDateTime = formData.isAllDay 
            ? `${formData.startDate}T00:00:00` 
            : `${formData.startDate}T${formData.startTime}:00`;
            
        const endDateTime = formData.isAllDay 
            ? `${formData.endDate}T23:59:59` 
            : `${formData.endDate}T${formData.endTime}:00`;
        
        // 색상 enum 변환
        const colorMap = {
            '#F87171': 'RED',
            '#FB923C': 'ORANGE',
            '#FBBF24': 'YELLOW',
            '#4ADE80': 'GREEN',
            '#60A5FA': 'BLUE',
            '#818CF8': 'NAVY',
            '#C084FC': 'PURPLE'
        };
        
        // 데이터 준비 및 제출
        const eventData = {
            userId: assignedUsers.map(user => user.userId),
            title: formData.title,
            isAllDay: formData.isAllDay,
            startTime: startDateTime,
            endTime: endDateTime,
            isAlarmOn: formData.notifyBefore,
            preNotificationTime: formData.notifyBefore ? formData.notifyHours : 0,
            color: colorMap[formData.color] || 'GREEN'
        };
        
        // 부모 컴포넌트의 onSubmit 호출
        onSubmit(eventData);
    };
    
    return (
        <MiddleFormModal
            isOpen={isOpen}
            onClose={onClose}
            title={schedule ? "일정 편집" : "일정 추가"}
            submitText="저장"
            cancelText="취소"
            onSubmit={handleSubmit}
            isSubmitDisabled={!formData.title}
            extraHeaderContent={
                schedule && (
                    <button
                        className="mr-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="일정 삭제"
                    >
                        <FiTrash2 size={20} />
                    </button>
                )
            }
        >
            {/* 참석자 선택 컴포넌트 */}
            <UserAttendanceContainer
                attendedUsers={assignedUsers}
                allUsers={projectUsers}
                onUserToggle={handleUserToggle}
                onUserRemove={handleUserRemove}
                title={`연관 팀원 (${assignedUsers.length}명)`}
            />

            {/* 일정 제목 */}
            <div className="space-y-1">
                <label htmlFor="title" className="text-sm text-gray-600">일정 제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="일정 제목을 입력하세요"
                />
            </div>

            {/* 시간 지정/종일 라디오 버튼 */}
            <div className="space-y-2">
                <label className="text-sm text-gray-600">일정 유형</label>
                <ModernRadioGroup 
                    options={[
                        { label: '시간 지정', value: false },
                        { label: '종일', value: true }
                    ]}
                    value={formData.isAllDay}
                    onChange={(e) => handleCheckboxChange({ target: { name: 'isAllDay', checked: e.target.value } })}
                    name="isAllDay"
                />
            </div>
            
            {/* 시작일 및 시간 */}
            <div className="space-y-1">
                <label htmlFor="startDate" className="text-sm text-gray-600">시작일</label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {!formData.isAllDay && (
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    )}
                </div>
            </div>
            
            {/* 종료일 및 시간 */}
            <div className="space-y-1">
                <label htmlFor="endDate" className="text-sm text-gray-600">종료일</label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {!formData.isAllDay && (
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    )}
                </div>
            </div>
            
            {/* 알림 설정 - 모던 라디오 버튼 */}
            <div className="space-y-2">
                <label className="text-sm text-gray-600">알림 설정</label>
                <ModernRadioGroup 
                    options={[
                        { label: '알림 안함', value: false },
                        { label: '알림 설정', value: true }
                    ]}
                    value={formData.notifyBefore}
                    onChange={(e) => handleCheckboxChange({ target: { name: 'notifyBefore', checked: e.target.value } })}
                    name="notifyBefore"
                />
                
                {formData.notifyBefore && (
                    <div className="flex items-center gap-2 mt-3 pl-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="notifyHours"
                                name="notifyHours"
                                value={formData.notifyHours}
                                onChange={handleNotifyHoursChange}
                                min="0"
                                max="72"
                                className="w-16 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-600">시간 전에 알림</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 색상 선택 */}
            <ColorPalette
                selectedColor={formData.color}
                onSelectColor={handleColorSelect}
            />
        </MiddleFormModal>
    );
};

export default MiddleFormScheduleCreateEditModal;