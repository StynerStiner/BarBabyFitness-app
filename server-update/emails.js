// server-update/emails.js
const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send confirmation email to customer
async function sendConfirmationEmail(email, name, sessionData) {
  try {
    const planName = sessionData.metadata.planName;
    const { data, error } = await resend.emails.send({
      from: "noreply@barbabyfit.com",
      to: email,
      subject: "Thank you for your BarBaby Fitness purchase!",
      html: `<div>
        <h1>Thank you for your purchase, ${name}!</h1>
        <p>Your payment for the ${planName} has been processed successfully.</p>
        <p>Our team will be in touch shortly to schedule your first session.</p>
      </div>`
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendConfirmationEmail:", error);
    return { success: false, error };
  }
}

// Function to send admin notification
async function sendAdminNotification(sessionData) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@barbabyfit.com";
    const customerName = sessionData.metadata.customerName;
    const customerEmail = sessionData.customer_email || sessionData.metadata.customerEmail;
    const customerPhone = sessionData.metadata.customerPhone;
    const planName = sessionData.metadata.planName;
    const planDuration = sessionData.metadata.planDuration;
    const planSessions = sessionData.metadata.planSessions;

    const { data, error } = await resend.emails.send({
      from: "notifications@barbabyfit.com",
      to: adminEmail,
      subject: "New BarBaby Fitness Purchase!",
      html: `<div>
        <h1>New Purchase Alert!</h1>
        <p>A new customer has purchased a training plan:</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Plan:</strong> ${planName}</p>
        <p><strong>Duration:</strong> ${planDuration}</p>
        <p><strong>Sessions:</strong> ${planSessions}</p>
        <p>Please contact the customer to schedule their first session.</p>
      </div>`
    });

    if (error) {
      console.error("Error sending admin notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendAdminNotification:", error);
    return { success: false, error };
  }
}

module.exports = {
  sendConfirmationEmail,
  sendAdminNotification
};
