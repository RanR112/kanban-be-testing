const nodemailer = require("nodemailer");
const prisma = require("../../prisma/client");
require("dotenv").config();

// Create transporter once and reuse
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send single notification (backward compatibility)
 */
exports.sendNotification = async (user, request, message) => {
    const notifications = [{
        user,
        request,
        message
    }];
    
    return await exports.sendBatchNotifications(notifications);
};

/**
 * Send batch notifications optimized for performance
 */
exports.sendBatchNotifications = async (notifications) => {
    if (!notifications || notifications.length === 0) {
        return { success: true, sent: 0, failed: 0 };
    }

    const results = {
        success: true,
        sent: 0,
        failed: 0,
        errors: []
    };

    try {
        // Prepare email options for batch sending
        const emailPromises = notifications.map(async ({ user, request, message }) => {
            const mailOptions = {
                from: "PC Department <pcdept@gmail.com>",
                to: user.email,
                subject: "Ada Request Kanban",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Notifikasi Request Kanban</h2>
                        <p>Hai <strong>${user.name}</strong>,</p>
                        <p>${message}</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #666; margin: 0 0 10px 0;">Detail Request:</h3>
                            <p><strong>ID Kanban:</strong> ${request.id_kanban}</p>
                            <p><strong>Requester:</strong> ${request.nama_requester || 'N/A'}</p>
                            <p><strong>Lokasi:</strong> ${request.lokasi || 'Pending'}</p>
                            <p><strong>Tanggal Request:</strong> ${new Date(request.createdAt || Date.now()).toLocaleDateString('id-ID')}</p>
                        </div>
                        <p style="color: #666; font-size: 12px;">
                            Email ini dikirim secara otomatis oleh sistem PC Department. 
                            Mohon tidak membalas email ini.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 11px; text-align: center;">
                            © ${new Date().getFullYear()} Production Control Department. All rights reserved.
                        </p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                return { success: true, email: user.email };
            } catch (error) {
                console.error(`Failed to send email to ${user.email}:`, error.message);
                return { success: false, email: user.email, error: error.message };
            }
        });

        // Execute all email sends concurrently
        const emailResults = await Promise.allSettled(emailPromises);
        
        // Process results
        emailResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.success) {
                results.sent++;
            } else {
                results.failed++;
                const errorInfo = result.status === 'rejected' 
                    ? result.reason 
                    : result.value.error;
                
                results.errors.push({
                    email: notifications[index].user.email,
                    error: errorInfo
                });
            }
        });

        // Update overall success status
        results.success = results.failed === 0;

        console.log(`Batch notification results: ${results.sent} sent, ${results.failed} failed`);
        
        return results;

    } catch (error) {
        console.error('Batch notification error:', error);
        results.success = false;
        results.errors.push({
            type: 'batch_error',
            error: error.message
        });
        return results;
    }
};