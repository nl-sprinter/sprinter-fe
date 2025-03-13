// 태스크 생성 함수
const handleCreateTask = async () => {
  try {
    const response = await addTaskToBacklog(projectId, sprintId, backlogId, taskData);
    
    // 생성된 태스크의 ID를 상태에 즉시 반영
    const newTaskId = response.data.id; // API 응답에 따라 경로가 다를 수 있음
    
    // 상태 업데이트 (구체적인 방법은 코드 구조에 따라 다름)
    setTasks(prev => [...prev, { ...taskData, id: newTaskId }]);
    
    // 또는 부모 컴포넌트로 새 태스크 정보 전달
    onTaskCreated({ ...taskData, id: newTaskId });
    
  } catch (error) {
    console.error('태스크 생성 중 오류 발생:', error);
  }
}; 