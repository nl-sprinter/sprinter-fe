import React, { memo } from 'react';
import {ScheduleCard} from "../common/ScheduleCard";

export const MyScheduleContainer = memo(({ schedule = [], onScheduleClick }) => {
    // 스케줄 클릭 핸들러 - SPRINT 타입인 경우 무시
    const handleScheduleClick = (schedule) => {
        // SPRINT 타입이면 클릭 이벤트를 처리하지 않음
        if (schedule.scheduleType === 'SPRINT') {
            return;
        }
        // 일반 일정인 경우에만 클릭 이벤트 처리
        onScheduleClick(schedule);
    };

    return (
        <div className="w-full">
            <div className="space-y-2">
                {Array.isArray(schedule) && schedule.length > 0 ? (
                    schedule.map((schedule) => (
                        <ScheduleCard 
                            key={schedule.id} 
                            schedule={schedule} 
                            onClick={() => handleScheduleClick(schedule)}
                        />
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        등록된 스케줄이 없습니다
                    </div>
                )}
            </div>
        </div>
    );
});