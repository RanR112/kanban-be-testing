const nodemailer = require("nodemailer");
const prisma = require("../../prisma/client");
const axios = require("axios");
const FormData = require("form-data");
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
    const notifications = [
        {
            user,
            request,
            message,
        },
    ];

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
        whatsapp: { sent: 0, failed: 0, errors: [] },
        email: { sent: 0, failed: 0, errors: [] },
    };

    // Process each notification in parallel
    const promises = notifications.map(async ({ user, request, message }) => {
        if (!user || !message) {
            console.error("Invalid notification data:", { user, message });
            return;
        }

        // --- WhatsApp ---
        if (user.no_hp && message.trim()) {
            const waMessage = `Halo ${user.name},\n\n${message}`;
            const form = new FormData();
            form.append("target", user.no_hp);
            form.append("message", waMessage);
            form.append("delay", "1");
            form.append("countryCode", "62");

            try {
                const response = await axios.post(
                    "https://api.fonnte.com/send",
                    form,
                    {
                        headers: {
                            ...form.getHeaders(),
                            Authorization: process.env.FONNTE_API_KEY,
                        },
                    }
                );
                results.whatsapp.sent++;
            } catch (err) {
                results.whatsapp.failed++;
                results.whatsapp.errors.push({
                    no_hp: user.no_hp,
                    error: err.message,
                });
            }
        } else {
            results.whatsapp.failed++;
        }

        // --- Email ---
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
                        <p><strong>Requester:</strong> ${
                            request.nama_requester || "N/A"
                        }</p>
                        <p><strong>Lokasi:</strong> ${
                            request.lokasi || "Pending"
                        }</p>
                        <p><strong>Tanggal Request:</strong> ${new Date(
                            request.createdAt || Date.now()
                        ).toLocaleDateString("id-ID")}</p>
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
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            results.email.sent++;
        } catch (error) {
            results.email.failed++;
            results.email.errors.push({
                email: user.email,
                error: error.message,
            });
        }
    });

    await Promise.allSettled(promises);

    results.success =
        results.whatsapp.failed === 0 && results.email.failed === 0;

    return results;
};
