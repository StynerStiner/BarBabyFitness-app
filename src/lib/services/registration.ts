// src/lib/services/registration.ts
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { awsConfig } from '../aws/schema.js';
import type { FormState, MedicalConditions } from '../../pages/GymRegistrationForm/contexts/GymFormContext.js';

const dynamoDb = new DynamoDBClient({ region: awsConfig.region });
const s3 = new S3Client({ region: awsConfig.region });

export class RegistrationService {
  static async submitRegistration(formData: FormState) {
    const memberId = uuidv4();
    const registrationId = uuidv4();

    try {
      // 1. Save Member Information
      await this.saveMemberInfo(memberId, formData);
      
      // 2. Save Health Records
      await this.saveHealthRecords(memberId, formData);
      
      // 3. Save Emergency Contact
      await this.saveEmergencyContact(memberId, formData);
      
      // 4. Create Registration Record
      await this.createRegistration(registrationId, memberId, formData);

      return {
        success: true,
        memberId,
        registrationId
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to process registration');
    }
  }

  private static async saveMemberInfo(memberId: string, formData: FormState) {
    const command = new PutItemCommand({
      TableName: awsConfig.tables.MEMBERS,
      Item: {
        memberId: { S: memberId },
        firstName: { S: formData.firstName },
        lastName: { S: formData.lastName },
        email: { S: formData.email },
        phone: { S: formData.phone },
        dob: { S: formData.dob },
        gender: { S: formData.gender },
        streetAddress: { S: formData.streetAddress },
        streetAddress2: { S: formData.streetAddress2 || '' },
        city: { S: formData.city },
        state: { S: formData.state },
        zipCode: { S: formData.zipCode },
        createdAt: { S: new Date().toISOString() }
      }
    });

    await dynamoDb.send(command);
  }

  private static async saveHealthRecords(memberId: string, formData: FormState) {
    const command = new PutItemCommand({
      TableName: awsConfig.tables.HEALTH_RECORDS,
      Item: {
        memberId: { S: memberId },
        height: { S: formData.height },
        currentWeight: { S: formData.currentWeight },
        goalWeight: { S: formData.goalWeight },
        isFirstTime: { BOOL: formData.isFirstTime },
        hasMedicalConditions: { S: formData.hasMedicalConditions },
        medicalConditions: { M: this.formatMedicalConditions(formData.medicalConditions) },
        medicalDetails: { S: formData.medicalDetails },
        wearsMedicalAlert: { BOOL: formData.wearsMedicalAlert },
        updatedAt: { S: new Date().toISOString() }
      }
    });

    await dynamoDb.send(command);
  }

  private static async saveEmergencyContact(memberId: string, formData: FormState) {
    const command = new PutItemCommand({
      TableName: awsConfig.tables.EMERGENCY_CONTACTS,
      Item: {
        memberId: { S: memberId },
        firstName: { S: formData.emergencyContact.firstName },
        lastName: { S: formData.emergencyContact.lastName },
        phone: { S: formData.emergencyContact.phone },
        relationship: { S: formData.emergencyContact.relationship },
        updatedAt: { S: new Date().toISOString() }
      }
    });

    await dynamoDb.send(command);
  }

  private static async createRegistration(
    registrationId: string, 
    memberId: string, 
    formData: FormState
  ) {
    const command = new PutItemCommand({
      TableName: awsConfig.tables.REGISTRATIONS,
      Item: {
        registrationId: { S: registrationId },
        memberId: { S: memberId },
        selectedPlan: this.formatPlanData(formData.selectedPlan),
        selectedDuration: { S: formData.selectedDuration },
        startDate: { S: formData.startDate },
        addons: { M: this.formatAddons(formData.addons) },
        status: { S: 'PENDING_CONTRACT' },
        createdAt: { S: new Date().toISOString() }
      }
    });

    await dynamoDb.send(command);
  }

  private static formatMedicalConditions(conditions: MedicalConditions) {
    const formatted: Record<string, { BOOL: boolean }> = {};
    // Explicitly type the keys we know exist in MedicalConditions
    const medicalKeys: Array<keyof MedicalConditions> = [
      'heartCondition',
      'asthma',
      'diabetes',
      'highBloodPressure',
      'jointIssues',
      'allergies'
    ];
    
    for (const key of medicalKeys) {
      formatted[key as string] = { BOOL: conditions[key] };
    }
    return formatted;
  }

  private static formatPlanData(plan: FormState['selectedPlan']) {
    if (!plan) return { NULL: true };
    return { 
      M: {
        id: { S: plan.id },
        title: { S: plan.title },
        duration: { S: plan.duration },
        price: { S: plan.price },
        sessions: { S: plan.sessions }
      }
    };
  }

  private static formatAddons(addons: Partial<Record<string, boolean>>) {
    const formatted: Record<string, { BOOL: boolean }> = {};
    for (const [key, value] of Object.entries(addons)) {
      if (value !== undefined) {
        formatted[key] = { BOOL: value };
      }
    }
    return formatted;
  }
}