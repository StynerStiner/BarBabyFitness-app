// utils/formProcessor.ts
export const processFormData = (data: Record<string, any>) => {
  return {
    ...data,
    processedAt: new Date().toISOString(),
    // Add any additional processing logic here
    // For example, formatting dates, phone numbers, etc.
    phone: formatPhoneNumber(data.phone),
    emergencyContact: {
      ...data.emergencyContact,
      phone: formatPhoneNumber(data.emergencyContact?.phone),
    },
  };
};

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phone;
};
