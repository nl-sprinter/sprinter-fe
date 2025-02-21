import axiosInstance from './axiosConfig';

export const sendStartingForm = async (formData) => {
    const response = await axiosInstance.post('/startingform/gptData', {
        projectName: formData.projectName,
        projectGoal: formData.projectGoal,
        estimatedDuration: formData.projectDuration,
        sprintCycle: formData.sprintCycle,
        teamMembers: parseInt(formData.teamMembers),
        essentialFeatures: formData.keyRequirements
    });
    return response.data;
}; 