const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
    constructor() {
        // Configure nodemailer transporter
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    /**
     * Send OTP email to user
     */
    async sendOTPEmail(email, otp, userName = "User") {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department <pcdept@gmail.com>",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Password Reset - Verification Code",
                html: this.generateOTPEmailTemplate(otp, userName),
            };

            const result = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: result.messageId,
            };
        } catch (error) {
            console.error("Email sending error:", error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    /**
     * Generate HTML template for OTP email
     */
    generateOTPEmailTemplate(otp, userName) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                }
                .header {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                }
                .otp-code {
                    background: #3498db;
                    color: white;
                    font-size: 32px;
                    font-weight: bold;
                    text-align: center;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                    letter-spacing: 5px;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                
                <p>Hello <strong>${userName}</strong>,</p>
                
                <p>You have requested to reset your password for your Kanban System account. Please use the verification code below to proceed:</p>
                
                <div class="otp-code">
                    ${otp}
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                        <li>This code will expire in <strong>10 minutes</strong></li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>For security, we recommend changing your password regularly</li>
                    </ul>
                </div>
                
                <p>If you have any questions or concerns, please contact our support team.</p>
                
                <div class="footer">
                    <p>This is an automated message from Kanban System</p>
                    <p>Please do not reply to this email</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            await this.transporter.verify();
            return { success: true, message: "Email service is ready" };
        } catch (error) {
            return {
                success: false,
                message: `Email service error: ${error.message}`,
            };
        }
    }
}

module.exports = new EmailService();
