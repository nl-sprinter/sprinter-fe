import axiosInstance from './axiosInstance';

export const sendStartingForm = async (formData) => {
    console.log(JSON.stringify(formData));

    const response = await axiosInstance.post('/startingform/gptData', {
        projectName: formData.projectName,
        projectGoal: formData.projectGoal,
        projectDomain: formData.projectDomain,
        teamMembers: parseInt(formData.teamMembers),
        teamPositions: formData.teamPositions,
        estimatedDuration: formData.estimatedDuration,
        sprintCycle: formData.sprintCycle,
        backlogDetailLevel: formData.backlogDetailLevel,
        preferredTechStack: formData.preferredTechStack,
        essentialFeatures: formData.essentialFeatures
    });
    return response.data;
}; 