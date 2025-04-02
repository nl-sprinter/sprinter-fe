import { useState, useEffect } from 'react';
import MiddleFormModal from './MiddleFormModal';
import UserAttendanceContainer from "../../containers/UserAttendanceContainer";
import { getUsersInProject } from '../../../api/projectApi';
import { FiTrash2 } from 'react-icons/fi';
import SmallFormModal from './SmallFormModal';
import SmallInfoModal from '../info/SmallInfoModal';

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
    onDelete,
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

    // 삭제 관련 상태 추가
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
    // 저장 성공 상태 추가
    const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);

    const [formError, setFormError] = useState('');

    // 프로젝트 유저 로드 (이 useEffect를 별도로 분리)
    useEffect(() => {
        if (isOpen && projectId) {
            fetchProjectUsers();
        }
    }, [isOpen, projectId]);

    // 스케줄 데이터 로드 (projectUsers 의존성 제거)
    useEffect(() => {
        if (isOpen && schedule) {
            // API 응답 형식에 맞춰 startDate, startTime, endDate, endTime 추출
            const startDateTime = schedule.startTime ? new Date(schedule.startTime) : new Date();
            const endDateTime = schedule.endTime ? new Date(schedule.endTime) : new Date();
            
            const startDate = startDateTime.toISOString().split('T')[0];
            const startTime = startDateTime.toTimeString().slice(0, 5); // HH:MM 형식
            
            const endDate = endDateTime.toISOString().split('T')[0];
            const endTime = endDateTime.toTimeString().slice(0, 5); // HH:MM 형식
            
            // 색상 코드 변환
            const colorMap = {
                'RED': '#F87171',
                'ORANGE': '#FB923C',
                'YELLOW': '#FBBF24',
                'GREEN': '#4ADE80',
                'BLUE': '#60A5FA',
                'NAVY': '#818CF8',
                'PURPLE': '#C084FC'
            };
            
            // 기존 이벤트 데이터 로드
            setFormData({
                title: schedule.title || '',
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                isAllDay: schedule.isAllDay || false,
                notifyBefore: schedule.notify || false,
                notifyHours: schedule.preNotificationHours || 3,
                color: colorMap[schedule.color] || '#F87171',
            });
        } else if (isOpen) {
            // 추가 모드
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
    }, [isOpen, schedule]);

    // 유저 ID를 기반으로 할당된 사용자 목록을 설정하는 useEffect를 별도로 추가
    useEffect(() => {
        if (isOpen && schedule && schedule.userId && Array.isArray(schedule.userId) && projectUsers.length > 0) {
            // 프로젝트 유저 목록에서 userId에 해당하는 유저 정보만 필터링하여 설정
            const usersToSet = projectUsers.filter(user => 
                schedule.userId.includes(user.userId)
            );
            setAssignedUsers(usersToSet);
        }
    }, [isOpen, schedule, projectUsers]);
    
    // 프로젝트 유저 로드 함수
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
    
    // 입력 필드 변경 처리 - 시작일/시간 변경 시 종료일/시간 자동 설정 추가
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // 새로운 폼 데이터 생성
        const newFormData = { ...formData, [name]: value };
        
        // 시작일 또는 시작 시간이 변경된 경우
        if (name === 'startDate' || name === 'startTime') {
            // 시작일/시간 기준으로 종료일/시간 설정
            const startDate = name === 'startDate' ? value : formData.startDate;
            const startTime = name === 'startTime' ? value : formData.startTime;
            
            // 시작 날짜/시간 객체 생성
            const startDateTime = new Date(`${startDate}T${startTime}`);
            
            // 종료 시간은 시작 시간 + 1시간으로 설정
            const endDateTime = new Date(startDateTime.getTime());
            endDateTime.setHours(endDateTime.getHours() + 1);
            
            // 종료일/시간 포맷팅
            const endDate = endDateTime.toISOString().split('T')[0];
            const endHours = endDateTime.getHours().toString().padStart(2, '0');
            const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
            const endTime = `${endHours}:${endMinutes}`;
            
            // 종료일/시간이 시작일/시간보다 이전인 경우에만 업데이트
            const currentEndDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
            if (currentEndDateTime < startDateTime) {
                newFormData.endDate = endDate;
                newFormData.endTime = endTime;
            }
        }
        
        // 폼 데이터 업데이트
        setFormData(newFormData);
        
        // 폼 유효성 검사
        validateForm(newFormData);
    };
    
    // 폼 유효성 검사 함수
    const validateForm = (data = formData) => {
        // 시작일/시간과 종료일/시간 비교
        const startDateTime = new Date(`${data.startDate}T${data.isAllDay ? '00:00' : data.startTime}`);
        const endDateTime = new Date(`${data.endDate}T${data.isAllDay ? '23:59' : data.endTime}`);
        
        if (endDateTime < startDateTime) {
            setFormError('종료일(시간)은 시작일(시간)보다 이후여야 합니다.');
            return false;
        }
        
        setFormError('');
        return true;
    };
    
    // 체크박스/라디오 변경 처리 - 종일 설정 시 시간 자동 조정
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const newFormData = { ...formData, [name]: checked };
        
        // 종일 설정이 변경된 경우
        if (name === 'isAllDay') {
            if (checked) {
                // 종일로 변경 시 시작 시간은 00:00, 종료 시간은 23:59로 설정
                newFormData.startTime = '00:00';
                newFormData.endTime = '23:59';
            } else {
                // 시간 지정으로 변경 시 기본 시간 설정
                newFormData.startTime = '09:00';
                newFormData.endTime = '10:00';
            }
        }
        
        setFormData(newFormData);
        validateForm(newFormData);
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
    
    // 삭제 버튼 클릭 핸들러 수정
    const handleDelete = () => {
        setIsDeleteConfirmOpen(true);
    };
    
    // 삭제 확인 처리
    const handleConfirmDelete = () => {
        setIsDeleteConfirmOpen(false);
        onDelete && onDelete();
        setIsDeleteSuccessOpen(true);
    };
    
    // 삭제 성공 모달 닫기
    const handleCloseDeleteSuccess = () => {
        setIsDeleteSuccessOpen(false);
        onClose(); // 스케줄 모달도 함께 닫기
    };
    
    // 저장 성공 모달 닫기
    const handleCloseSaveSuccess = () => {
        setIsSaveSuccessOpen(false);
        onClose(); // 스케줄 모달도 함께 닫기
    };
    
    // 폼 제출 처리 수정 - 유효성 검사 추가
    const handleSubmit = () => {
        // 폼 유효성 검사
        if (!validateForm()) {
            return;
        }
        
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
        const scheduleData = {
            userId: assignedUsers.map(user => user.userId),
            title: formData.title,
            isAllDay: formData.isAllDay,
            startTime: startDateTime,
            endTime: endDateTime,
            notify: formData.notifyBefore,
            preNotificationHours: formData.notifyBefore ? formData.notifyHours : 0,
            color: colorMap[formData.color] || 'GREEN'
        };

        // 부모 컴포넌트의 onSubmit 호출
        onSubmit(scheduleData);
        
        // 저장 성공 모달 표시
        setIsSaveSuccessOpen(true);
    };
    
    return (
        <>
            <MiddleFormModal
                isOpen={isOpen}
                onClose={onClose}
                title={schedule ? "스케줄 편집" : "스케줄 추가"}
                submitText="저장"
                cancelText="취소"
                onSubmit={handleSubmit}
                isSubmitDisabled={!formData.title || !!formError}
                extraHeaderContent={
                    schedule && (
                        <button
                            className="text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="스케줄 삭제"
                            onClick={handleDelete}
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

                {/* 스케줄 제목 */}
                <div className="space-y-1">
                    <label htmlFor="title" className="text-sm text-gray-600">스케줄 제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="스케줄 제목을 입력하세요"
                    />
                </div>

                {/* 시간 지정/종일 라디오 버튼 */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">스케줄 유형</label>
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

                {/* 오류 메시지 표시 */}
                {formError && (
                    <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm">
                        {formError}
                    </div>
                )}
            </MiddleFormModal>
            
            {/* 삭제 확인 모달 */}
            <SmallFormModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="스케줄 삭제"
                submitText="삭제"
                cancelText="취소"
                onSubmit={handleConfirmDelete}
            >
                <p className="text-gray-600">정말 이 스케줄을 삭제하시겠습니까?</p>
            </SmallFormModal>
            
            {/* 삭제 완료 알림 모달 */}
            <SmallInfoModal
                isOpen={isDeleteSuccessOpen}
                onClose={handleCloseDeleteSuccess}
                title="삭제 완료"
                message="스케줄이 성공적으로 삭제되었습니다."
                type="success"
            />
            
            {/* 저장 완료 알림 모달 */}
            <SmallInfoModal
                isOpen={isSaveSuccessOpen}
                onClose={handleCloseSaveSuccess}
                title="저장 완료"
                message={schedule ? "스케줄이 성공적으로 수정되었습니다." : "스케줄이 성공적으로 저장되었습니다."}
                type="success"
            />
        </>
    );
};

export default MiddleFormScheduleCreateEditModal;