/**
 * Contract service that handles uploading contracts with a three-tier storage approach:
 * 1. Primary: Cloudflare R2
 * 2. Secondary: Appwrite
 * 3. Tertiary: Local filesystem
 */

import axios from 'axios';

/**
 * Uploads a contract using the three-tier storage system
 * @param contractData The contract data to upload
 * @param signatures The client and trainer signatures
 * @returns The URL to the uploaded contract
 */
export const uploadContract = async (contractData: any, signatures: any): Promise<string> => {
  try {
    // Ensure contractData is properly structured with all components
    const normalizedData = organizeContractData(contractData);
    
    // Create FormData to send to the API
    const formData = new FormData();
    
    // Add contract data as JSON
    formData.append('contractData', JSON.stringify(normalizedData));
    
    // Add signatures
    if (signatures.client) {
      formData.append('clientSignature', signatures.client);
    }
    
    if (signatures.trainer) {
      formData.append('trainerSignature', signatures.trainer);
    }
    
    // Send to our API endpoint that handles the three-tier storage
    const response = await fetch('/api/upload-contract', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload contract');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to upload contract');
    }
    
    return data.url;
  } catch (error: any) {
    console.error('Error in contract service:', error);
    throw new Error(`Contract upload failed: ${error.message}`);
  }
};

/**
 * Organizes all contract data from various form components to ensure everything is properly captured
 * @param contractData The raw contract data from form state
 * @returns Normalized and structured contract data
 */
function organizeContractData(contractData: any): any {
  // Create a new object to store all organized data
  const normalizedData = { ...contractData };
  
  // Ensure personal information is structured properly
  normalizedData.personalInfo = {
    firstName: contractData.firstName || contractData.personalInfo?.firstName || '',
    lastName: contractData.lastName || contractData.personalInfo?.lastName || '',
    email: contractData.email || contractData.personalInfo?.email || '',
    phone: contractData.phone || contractData.phoneNo || contractData.personalInfo?.phone || '',
    dateOfBirth: contractData.dateOfBirth || contractData.dob || contractData.personalInfo?.dateOfBirth || '',
    gender: contractData.gender || contractData.personalInfo?.gender || ''
  };
  
  // Ensure address is structured properly
  normalizedData.address = {
    street: contractData.streetAddress || contractData.address?.street || '',
    street2: contractData.streetAddress2 || contractData.address?.street2 || '',
    city: contractData.city || contractData.address?.city || '',
    state: contractData.state || contractData.address?.state || '',
    zipCode: contractData.zipCode || contractData.address?.zipCode || ''
  };
  
  // Ensure health metrics are structured properly
  normalizedData.healthMetrics = {
    currentWeight: contractData.currentWeight || contractData.weight || contractData.healthMetrics?.currentWeight || '',
    goalWeight: contractData.goalWeight || contractData.targetWeight || contractData.healthMetrics?.goalWeight || '',
    height: contractData.height || contractData.heightCm || contractData.healthMetrics?.height || '',
    fitnessLevel: contractData.fitnessLevel || contractData.healthMetrics?.fitnessLevel || ''
  };
  
  // Ensure medical information is structured properly
  normalizedData.medicalInfo = {
    medicalConditions: {
      heartCondition: contractData.heartCondition || contractData.hasHeartCondition || contractData.medicalConditions?.heartCondition || false,
      asthma: contractData.asthma || contractData.hasAsthma || contractData.medicalConditions?.asthma || false,
      diabetes: contractData.diabetes || contractData.hasDiabetes || contractData.medicalConditions?.diabetes || false,
      highBloodPressure: contractData.highBloodPressure || contractData.hasHighBloodPressure || contractData.medicalConditions?.highBloodPressure || false,
      jointIssues: contractData.jointIssues || contractData.hasJointIssues || contractData.medicalConditions?.jointIssues || false,
      allergies: contractData.allergies || contractData.hasAllergies || contractData.medicalConditions?.allergies || false
    },
    medicalDetails: contractData.medicalDetails || contractData.additionalMedicalDetails || contractData.medicalNotes || '',
    consentToMedicalTreatment: contractData.consentToMedicalTreatment || contractData.consentToEmergencyTreatment || false,
    wearsMedicalAlert: contractData.wearsMedicalAlert || contractData.hasMedicalAlert || false
  };
  
  // Ensure emergency contact information is structured properly
  const emergencyContact = contractData.emergencyContact || {};
  normalizedData.emergencyContact = {
    firstName: emergencyContact.firstName || '',
    lastName: emergencyContact.lastName || '',
    name: emergencyContact.name || `${emergencyContact.firstName || ''} ${emergencyContact.lastName || ''}`.trim(),
    phone: emergencyContact.phone || emergencyContact.phoneNumber || '',
    relationship: emergencyContact.relationship || ''
  };
  
  // Ensure membership details are structured properly
  normalizedData.membership = {
    preferredStartDate: contractData.startDate || contractData.preferredStartDate || '',
    selectedDuration: contractData.selectedDuration || contractData.membershipDuration || contractData.duration || '',
    addons: {
      lockerRental: contractData.lockerRental || contractData.addons?.lockerRental || false,
      towelService: contractData.towelService || contractData.addons?.towelService || false,
      guestPasses: contractData.guestPasses || contractData.addons?.guestPasses || false,
      freezeOption: contractData.freezeOption || contractData.addons?.freezeOption || false
    }
  };
  
  // Ensure selected plan information is captured
  if (!normalizedData.selectedPlan && contractData.selectedPlan) {
    normalizedData.plan = contractData.selectedPlan;
  } else if (!normalizedData.plan && contractData.plan) {
    normalizedData.plan = contractData.plan;
  }
  
  // Additional user preferences
  normalizedData.preferences = {
    isFirstTime: contractData.isFirstTime || contractData.firstTimeAtGym || false,
    wantsPersonalTraining: contractData.wantsPersonalTraining || contractData.interestedInPersonalTraining || false,
    wantsGroupClasses: contractData.wantsGroupClasses || contractData.interestedInGroupClasses || false,
    needsNutritionGuidance: contractData.needsNutritionGuidance || contractData.nutritionGuidance || false
  };
  
  return normalizedData;
}

/**
 * Save registration data to the server
 */
export const saveRegistration = async (registrationData: any): Promise<{registrationId: string, url: string}> => {
  try {
    const response = await axios.post('/api/save-registration', registrationData);
    
    if (response.data.success) {
      return {
        registrationId: response.data.registrationId,
        url: response.data.url
      };
    } else {
      throw new Error(response.data.message || 'Failed to save registration data');
    }
  } catch (error) {
    console.error('Error saving registration data:', error);
    throw error;
  }
};