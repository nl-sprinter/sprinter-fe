import React from 'react';
import {ScheduleCard} from "../common/ScheduleCard";

export const MyScheduleContainer = ({ schedule }) => {

    console.log(`MyScheduleContainer  -  schedule = ${JSON.stringify(schedule)}`);

    return (
        <div className="w-full">
            <div className="space-y-2">
                {schedule.map((schedule) => (
                    <ScheduleCard 
                        key={schedule.id} 
                        schedule={schedule} 
                    />
                ))}
                {schedule.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        등록된 스케줄이 없습니다
                    </div>
                )}
            </div>
        </div>
    );

}