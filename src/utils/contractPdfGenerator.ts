// Import PDFKit with proper typing approach for browser environment
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import type { Plan } from '@/pages/TrainingOptions/components/types';

// Define type for PDFDocument
type PDFDocumentType = typeof PDFDocument;

// Type augmentation for PDFDocument instance
interface ExtendedPDFDocument extends InstanceType<typeof PDFDocument> {
  _fontFamilies?: Record<string, Record<string, string>>;
  _font?: string;
}

// Create standard font objects for browser environment
const standardFonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italic: 'Helvetica-Oblique',
    boldItalic: 'Helvetica-BoldOblique'
  }
};

// Create custom font dictionary for browser environment
(PDFDocument.prototype as any)._fontFamilies = {
  'Helvetica': standardFonts.Helvetica
};

// Override the font handling mechanism
const originalFont = PDFDocument.prototype.font;
(PDFDocument.prototype as any).font = function(font: string, size?: number): ExtendedPDFDocument {
  if (typeof font === 'string') {
    // Use standard fonts already bundled with PDFKit
    const fontFamilies = (this as ExtendedPDFDocument)._fontFamilies;
    if (fontFamilies && fontFamilies['Helvetica']) {
      // Proper font assignment without changing the structure of _font
      return originalFont.call(this, font, size);
    } else {
      return originalFont.call(this, 'Helvetica', size);
    }
  }
  
  if (size != null) {
    this.fontSize(size);
  }
  
  return this;
};

interface ContractData {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNo: string;
  email?: string; // Make email optional since it's optional on the form
  plan: Plan;
  date: string;
}

/**
 * Converts snake_case or regular text to CamelCase format
 * @param text The text to convert
 * @returns The text in CamelCase format
 */
function toCamelCase(text: string): string {
  return text
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (match) => match.toUpperCase());
}

/**
 * Generates a contract PDF with the provided client and plan information
 * @param data Contract data including client information and plan details
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export async function generateContractPDF(data: ContractData): Promise<Blob> {
  return new Promise((resolve) => {
    // Create a document
    const doc = new PDFDocument({
      margins: { top: 72, left: 72, right: 72, bottom: 72 },
      info: {
        Title: 'BarBaby Fitness Contract Agreement',
        Author: 'BarBaby Fitness',
        Subject: 'Personal Training Contract Agreement',
        Keywords: 'contract, fitness, personal training, agreement',
        Creator: 'BarBaby Fitness Contract Generator',
      }
    });

    // Pipe its output to a blob stream
    const stream = doc.pipe(blobStream());

    // Set up formatting
    const titleFont = 'Helvetica-Bold';
    const bodyFont = 'Helvetica';
    const titleSize = 16;
    const headingSize = 14;
    const subheadingSize = 12;
    const bodySize = 10;
    const lineGap = 5;

    // Add the logo (if available)
    // doc.image('/path/to/logo.png', { fit: [250, 150], align: 'center' });

    // ==================== REGISTRATION FORM INFORMATION ====================
    
    // Add the header
    doc.font(titleFont).fontSize(titleSize).text('BAR BABY FITNESS', { align: 'center' });
    doc.fontSize(headingSize).text('PERSONAL TRAINING CONTRACT', { align: 'center' });
    doc.moveDown();

    // Add client info section from registration form
    doc.font(titleFont).fontSize(subheadingSize).text('Personal Information', { underline: true });
    doc.font(bodyFont).fontSize(bodySize).text(`First Name: ${toCamelCase(data.firstName)}`);
    doc.text(`Last Name: ${toCamelCase(data.lastName)}`);
    if (data.email) doc.text(`Email: ${data.email}`);
    doc.text(`Phone Number: ${data.phoneNo}`);
    doc.text(`Address: ${data.address.street}`);
    doc.text(`City: ${data.address.city}`);
    doc.text(`State: ${data.address.state}`);
    doc.text(`Zip Code: ${data.address.zipCode}`);
    doc.text(`Date: ${data.date}`);
    doc.moveDown();

    // Add plan details section
    doc.font(titleFont).fontSize(subheadingSize).text('Selected Plan Details', { underline: true });
    doc.font(bodyFont).fontSize(bodySize).text(`Plan: ${data.plan.title}`);
    doc.text(`Duration: ${data.plan.duration}`);
    doc.text(`Sessions: ${data.plan.sessions}`);
    doc.text(`Monthly Fee: ${data.plan.price.replace(/month.*$/, 'month')}`);
    doc.text(`Initiation Fee: ${data.plan.initiationFee}`);
    
    // Calculate and show total cost
    const priceValue = parseInt(data.plan.price.replace(/\$/g, ''), 10) || 0;
    const feeValue = parseInt(data.plan.initiationFee?.replace(/\$/g, '') || '0', 10);
    doc.font(titleFont).text(`Total Initial Payment: $${priceValue + feeValue}`);
    doc.moveDown();

    // ==================== COMPLETE CONTRACT TEXT ====================
    doc.addPage();
    doc.font(titleFont).fontSize(titleSize).text('PERSONAL TRAINING AGREEMENT', { align: 'center' });
    doc.moveDown();

    // Full contract text
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('This Personal Training Contract ("Contract") is entered into by and between Barbaby Fitness ("Trainer/Owner") and the undersigned client ("Client"). By signing below, the Client agrees to comply with the terms and conditions outlined in this Contract.', { align: 'left' });
    doc.moveDown();

    // 1. Contact Information & Facility Access
    doc.font(titleFont).fontSize(subheadingSize).text('1. Contact Information & Facility Access');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• Trainer/Owner Contact:');
    doc.text('• Phone: (323) 530-3182', { indent: 15 });
    doc.text('• Phone: (424) 468-4903', { indent: 15 });
    doc.text('• Facility Hours: Open 24 hours', { indent: 15 });
    doc.moveDown();

    // 2. Programs, Packages, and Fees
    doc.font(titleFont).fontSize(subheadingSize).text('2. Programs, Packages, and Fees');
    doc.font(bodyFont).fontSize(bodySize);
    
    // A. Initiation Fees
    doc.font(titleFont).fontSize(bodySize).text('A. Initiation Fees');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• A $100 initiation fee applies to all new clients or those who have not purchased a session in the last 12 months.', { indent: 15 });
    doc.text('• Partnership Program: Each participant must pay a $100 initiation fee at the start of their contract.', { indent: 15 });
    doc.text('• On the Go Program: A $200 initiation fee applies.', { indent: 15 });
    doc.moveDown();

    // B. Package Options
    doc.font(titleFont).fontSize(bodySize).text('B. Package Options');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('All sessions are 1 hour in duration and must be completed within 30 days from the first session of the package.');
    
    // 1. Individual Packages
    doc.text('1. Individual Packages', { indent: 5 });
    doc.text('• Barbaby Kick Starter: $195 for 3 sessions/month', { indent: 15 });
    doc.text('• Barbaby Steady Climb: $240 for 4 sessions/month', { indent: 15 });
    doc.text('• Barbaby Power Surge: $440 for 8 sessions/month', { indent: 15 });
    doc.text('• Barbaby Elite Focus: $600 for 12 sessions/month', { indent: 15 });
    
    // 2. Partnership Program
    doc.text('2. Partnership Program (12-Month Commitment)', { indent: 5 });
    doc.text('• Fee: $500 per month per participant (12 sessions per month)', { indent: 15 });
    doc.text('• Initiation: One-time $100 initiation fee per participant', { indent: 15 });
    doc.text('• Requirements:', { indent: 15 });
    doc.text('• A minimum of two participants at all times.', { indent: 25 });
    doc.text('• Each participant must have a partner and complete the full 12-month contract.', { indent: 25 });
    doc.text('• If a partner drops out, the remaining participant agrees to pay an additional $100 per month to cover the discount initially provided.', { indent: 25 });
    
    // 3. On the Go Program
    doc.text('3. On the Go Program', { indent: 5 });
    doc.text('• Fee: $75 per session', { indent: 15 });
    doc.text('• Initiation: $200', { indent: 15 });
    doc.moveDown();

    // Add a new page for the rest of the contract
    doc.addPage();
    
    // 3. Billing & Payment Terms
    doc.font(titleFont).fontSize(subheadingSize).text('3. Billing & Payment Terms');
    doc.font(bodyFont).fontSize(bodySize);

    // Billing Cycle
    doc.text('• Billing Cycle:', { continued: true });
    doc.text('', { indent: 15 });
    doc.text('• Packages are billed monthly or upon session completion.', { indent: 15 });
    doc.text('• If the Client does not complete sessions within 30 days, the package expires, and unused sessions are forfeited.', { indent: 15 });
    doc.text('• Unused sessions will not roll over, be credited, or refunded. It is the Client\'s responsibility to schedule and attend sessions within this timeframe.', { indent: 15 });
    
    // Cancellation Policy
    doc.text('• Cancellation Policy:', { continued: true });
    doc.text('', { indent: 15 });
    doc.text('• Clients may cancel future billing up to 3 days before the next scheduled payment.', { indent: 15 });
    doc.text('• Failure to cancel at least 3 days in advance will result in automatic billing for the next month.', { indent: 15 });
    doc.text('• All remaining sessions will be forfeited upon early contract cancellation, and no refunds or credits will be provided.', { indent: 15 });
    
    // Partnership Program Contract Termination
    doc.text('• Partnership Program Contract Termination:', { continued: true });
    doc.text('', { indent: 15 });
    doc.text('• If both participants wish to cancel the contract early, they must pay either:', { indent: 15 });
    doc.text('• Two months of the contract OR', { indent: 25 });
    doc.text('• Half of the remaining balance, whichever is less.', { indent: 25 });
    doc.text('• All remaining sessions will be forfeited upon early cancellation.', { indent: 15 });
    
    // Refund Policy
    doc.text('• Refund Policy:', { continued: true });
    doc.text('', { indent: 15 });
    doc.text('• No refunds will be issued under any circumstances, except in extreme cases approved by Barbaby Fitness.', { indent: 15 });
    doc.text('• Extreme cases may include:', { indent: 15 });
    doc.text('• Permanent disability preventing physical activity (must be documented by a licensed physician).', { indent: 25 });
    doc.text('• Relocation more than 50 miles away (must provide proof of address change).', { indent: 25 });
    doc.text('• Medical condition requiring long-term inactivity (6+ months, verified by a physician).', { indent: 25 });
    doc.text('• Refund requests must be submitted in writing with supporting documentation. Barbaby Fitness reserves the right to approve or deny any refund request.', { indent: 15 });
    
    // Late Payment Fee
    doc.text('• Late Payment Fee:', { continued: true });
    doc.text('', { indent: 15 });
    doc.text('• If a payment is not resolved within 5 business days, a $25 late fee will be applied. If the balance remains unpaid for 14 days, Barbaby Fitness reserves the right to suspend training and send the outstanding balance to collections.', { indent: 15 });
    doc.moveDown();

    // Continue with more sections - add a new page for better readability
    doc.addPage();

    // 4. Session Cancellation & No-Show Policy
    doc.font(titleFont).fontSize(subheadingSize).text('4. Session Cancellation & No-Show Policy');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• Cancellation Notice: Clients must cancel a scheduled session at least 5 hours in advance. Cancellations made within less than 5 hours will be considered a used session.');
    doc.text('• No-Shows: If a client fails to attend a scheduled session without prior notice, the session will be marked as completed and counted as a used session with no make-up session provided.');
    doc.moveDown();

    // 5. Client Health Disclosure & Liability Waiver
    doc.font(titleFont).fontSize(subheadingSize).text('5. Client Health Disclosure & Liability Waiver');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• Health Acknowledgment: The Client certifies that they have disclosed all relevant medical conditions, injuries, or physical limitations to Barbaby Fitness.');
    doc.text('• Assumption of Risk: The Client acknowledges that physical exercise carries inherent risks, including but not limited to muscle strains, sprains, cardiovascular events, and other injuries. The Client voluntarily assumes all risks associated with training.');
    doc.text('• Indemnification: The Client agrees to release, discharge, and indemnify Barbaby Fitness and its trainers from any and all liability, including personal injury, illness, or property damage, whether caused by negligence or otherwise.');
    doc.text('• Medical Emergency Clause: If the Client requires medical attention during a session, they consent to receive medical assistance, and all costs incurred will be the Client\'s sole responsibility.');
    doc.moveDown();

    // 6-13. Remaining sections
    doc.font(titleFont).fontSize(subheadingSize).text('6. Force Majeure (Unforeseen Events)');
    doc.font(bodyFont).fontSize(bodySize).text('"Barbaby Fitness is not responsible for service interruptions due to events beyond its control. In such cases, sessions may be rescheduled, but no refunds will be issued."');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('7. Social Media & Confidentiality Clause');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• The Client agrees not to make any defamatory, false, or misleading statements about Barbaby Fitness, its trainers, or services in any public forum, including social media, online reviews, or public discussions.');
    doc.text('• The Client further agrees not to share confidential business practices or trade secrets of Barbaby Fitness.');
    doc.text('• Violation of this clause may result in legal action.');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('8. Payment & Chargeback Policy');
    doc.font(bodyFont).fontSize(bodySize).text('"If a payment is declined, the Client must resolve it within 5 business days or training will be suspended. If a chargeback is initiated without valid cause, the Client is responsible for the disputed amount plus a $50 chargeback fee. Unresolved chargebacks may be sent to collections and reported to credit agencies."');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('9. Business Closure & Trainer Availability');
    doc.font(bodyFont).fontSize(bodySize).text('"If Barbaby Fitness is unable to provide training services due to unforeseen circumstances, sessions will be rescheduled at the Trainer\'s discretion. No refunds will be issued."');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('10. Dispute Resolution Clause');
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('• Any disputes arising under this Contract shall be resolved through binding arbitration in the State of Tennessee.');
    doc.text('• The Client agrees to waive any right to pursue legal action in a court of law.');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('11. Parental Consent (For Clients Under 18 Years Old)');
    doc.font(bodyFont).fontSize(bodySize).text('"For Clients under 18, a parent/guardian must sign this agreement and assume full responsibility for the Client\'s participation."');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('12. Photography & Video Consent (Optional)');
    doc.font(bodyFont).fontSize(bodySize).text('"By signing this Contract, the Client grants Barbaby Fitness permission to use their photos/videos for promotional and marketing purposes. If the Client does not wish to be photographed or recorded, they must provide written notice to Barbaby Fitness before training begins."');
    doc.moveDown();

    doc.font(titleFont).fontSize(subheadingSize).text('13. Acknowledgment & Agreement');
    doc.font(bodyFont).fontSize(bodySize).text('By signing below, the Client acknowledges that they have read and understood this Contract, including the policies regarding session completion, cancellations, billing, and refunds.');
    doc.moveDown();

    // ==================== LIABILITY WAIVER ====================
    doc.addPage();
    doc.font(titleFont).fontSize(titleSize).text('ASSUMPTION OF RISK & RELEASE OF LIABILITY', { align: 'center' });
    doc.moveDown();

    // Add note at top of waiver
    doc.font(titleFont).fontSize(bodySize).text('NOTE: THIS FORM MUST BE READ AND SIGNED BEFORE THE PARTICIPANT IS ALLOWED TO TAKE PART IN ANY ACTIVITIES.', { align: 'center' });
    doc.moveDown();

    // Waiver content
    doc.font(bodyFont).fontSize(bodySize);
    doc.text('I understand and agree that Bar Baby Fitness, LLC is NOT RESPONSIBLE for any injury, disability, death, or loss of property I may suffer while present at the fitness center ("Gym") for exercises, other activities, or for any reason whatsoever.');
    doc.moveDown();

    doc.text('For and in consideration of permission to enter the Gym or to perform any activities at the Gym, I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin, hereby release, discharge, waive and relinquish Bar Baby Fitness LLC, and any of their partners, affiliates, members, contractors, agents, volunteers, and employees ("Release"), from any or all present and future claims of injury, disability, death, or loss of property however they may occur, including any ordinary negligence, except for any intentional misconduct of release.');
    doc.moveDown();

    doc.text('Further, I am aware of the following risks, and numerous other inherent risks in observing or participating in any exercises or any incidental activities thereto. These risks include, but are not limited to, serious injury or death resulting from:');
    doc.moveDown(0.5);
    
    // List of risks
    doc.text('• Slips, trips, falls, collision with other persons in the gym', { indent: 15 });
    doc.text('• Malfunction of equipment', { indent: 15 });
    doc.text('• Muscle and tendon injuries', { indent: 15 });
    doc.text('• Fractures', { indent: 15 });
    doc.text('• Abnormal blood pressure', { indent: 15 });
    doc.text('• Fainting', { indent: 15 });
    doc.text('• Disorders of heart rhythm', { indent: 15 });
    doc.text('• Heart attack', { indent: 15 });
    doc.moveDown();

    doc.text('Although a complete list of all risks has not been provided to me, I subjectively understand the risks of my participation in exercises or other physical activities, and knowing and appreciating these risks, I voluntarily choose to be present at the Gym for exercise, other activities, or for any reason whatsoever, and assume all risks, both known and unknown, of personal injury, death or loss or damage to property. I further acknowledge that I have been advised to seek physician approval before participating in any exercises or other physical activities. I further acknowledge that I have had an opportunity to ask questions and any questions I have asked have been answered to my complete satisfaction. I further agree to indemnify and hold harmless Releases for all claims arising from my participation in exercise or other activities at the Gym.');
    doc.moveDown();

    doc.text('If any provision of this release is held to be invalid or unenforceable, then all other provisions shall continue to be valid and enforceable, and the valid or unenforceable provisions shall be modified, reformed, or restricted, to the minimum extent possible to make that provision valid and enforceable. I affirm that I am of legal age and freely read and sign this release.');
    doc.moveDown();

    doc.font(titleFont).fontSize(bodySize).text('I HAVE READ THIS ASSUMPTION OF RISK AGREEMENT AND RELEASE OF LIABILITY, FULLY UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.', { align: 'center' });
    doc.moveDown(2);

    // ==================== SIGNATURES ====================
    doc.addPage();
    doc.font(titleFont).fontSize(subheadingSize).text('SIGNATURES', { align: 'center', underline: true });
    doc.moveDown(2);

    // Areas for actual signatures (will be filled in with signature images)
    doc.font(bodyFont).fontSize(bodySize).text('BarBaby Fitness:', { continued: true });
    doc.text(`Date: ${data.date}`, { align: 'right' });
    // Space for BarBaby Fitness signature image
    doc.rect(72, doc.y, 200, 70).stroke();
    doc.moveDown(5);

    doc.font(bodyFont).fontSize(bodySize).text(`Client: ${toCamelCase(data.firstName)} ${toCamelCase(data.lastName)}`, { continued: true });
    doc.text(`Date: ${data.date}`, { align: 'right' });
    // Space for client signature image
    doc.rect(72, doc.y, 200, 70).stroke();
    doc.moveDown(2);

    // Finalize the document
    doc.end();

    // Return the blob stream
    stream.on('finish', () => {
      const blob = stream.toBlob('application/pdf');
      resolve(blob);
    });
  });
}

/**
 * Downloads the generated contract PDF
 * @param data Contract data
 * @param fileName Name of the file
 */
export async function downloadContractPDF(data: ContractData, fileName = 'barbaby-fitness-contract.pdf'): Promise<void> {
  const blob = await generateContractPDF(data);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Uploads the generated contract PDF to Cloudflare R2
 * @param data Contract data
 * @param signatures Signature data URLs
 * @returns A Promise that resolves to the URL of the uploaded PDF
 */
export async function uploadContractToR2(
  data: ContractData, 
  signatures: { 
    client: string; 
    trainer: string; 
    participant?: string;
  }
): Promise<string> {
  // Generate the PDF
  const pdfBlob = await generateContractPDF(data);
  
  // Create form data for upload
  const formData = new FormData();
  formData.append('file', pdfBlob, `contract_${data.lastName.toLowerCase()}_${Date.now()}.pdf`);
  formData.append('clientName', `${data.firstName} ${data.lastName}`);
  formData.append('clientSignature', signatures.client);
  formData.append('trainerSignature', signatures.trainer);
  if (signatures.participant) {
    formData.append('participantSignature', signatures.participant);
  }
  
  try {
    // Upload to your API endpoint that handles Cloudflare R2 upload
    const response = await fetch('/api/upload-contract', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload contract');
    }
    
    const data = await response.json();
    return data.url; // Return the URL of the uploaded document
    
  } catch (error) {
    console.error('Error uploading contract to R2:', error);
    throw error;
  }
}