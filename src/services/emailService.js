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
            pool: true, // Use connection pooling
            maxConnections: 5,
            maxMessages: 100,
        });

        // Test connection on startup
        this.testConnection();
    }

    /**
     * Send OTP email for password reset
     */
    async sendOTPEmail(email, otp, name = "User") {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Password Reset - Verification Code",
                html: this.generateOTPEmailTemplate(otp, name),
                text: this.generateOTPTextTemplate(otp, name), // Fallback for text-only clients
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Password reset OTP email sent to ${email}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "password_reset",
            };
        } catch (error) {
            console.error("Password reset email sending error:", error);
            throw new Error(
                `Failed to send password reset email: ${error.message}`
            );
        }
    }

    /**
     * Send email verification OTP
     */
    async sendEmailVerificationOTP(email, name, otp) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Email Verification - Confirmation Code",
                html: this.generateEmailVerificationTemplate(name, otp),
                text: this.generateEmailVerificationTextTemplate(name, otp),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Email verification OTP sent to ${email}, ${name}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "email_verification",
            };
        } catch (error) {
            console.error("Email verification sending error:", error);
            throw new Error(
                `Failed to send email verification: ${error.message}`
            );
        }
    }

    async sendEmailVerified(email, name, departmentName) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Registration Success",
                html: this.generateEmailVerifiedTemplate(name, departmentName),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Email Verified email sent to ${email}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "email_verified",
            };
        } catch (error) {
            console.error("Email Verified email sending error:", error);
            return {
                success: false,
                error: error.message,
                type: "email_verified",
            };
        }
    }

    async sendRegistrationRejectionEmail(email, name, rejectionReason) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Registration Status - Application Not Approved",
                html: this.generateRegistrationRejectTemplate(
                    name,
                    rejectionReason
                ),
                text: this.generateRegistrationRejectTextTemplate(
                    name,
                    rejectionReason
                ),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Registration rejection email sent to ${email}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "registration_rejection",
            };
        } catch (error) {
            console.error("Registration rejection email sending error:", error);
            return {
                success: false,
                error: error.message,
                type: "registration_rejection",
            };
        }
    }

    /**
     * Send admin notification for new registration
     */
    async sendAdminNotificationEmail(
        adminEmail,
        adminName = "Admin",
        registrationData
    ) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: adminEmail,
                subject: "New Employee Registration - Pending Approval",
                html: this.generateAdminNotificationTemplate(
                    adminName,
                    registrationData
                ),
                text: this.generateAdminNotificationTextTemplate(
                    registrationData
                ),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Admin notification email sent to ${adminEmail}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "admin_notification",
            };
        } catch (error) {
            console.error("Admin notification email sending error:", error);
            return {
                success: false,
                error: error.message,
                type: "admin_notification",
            };
        }
    }

    /**
     * Send welcome email after successful registration
     */
    async sendWelcomeEmail(email, name, departmentName) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Welcome to Kanban System",
                html: this.generateWelcomeEmailTemplate(name, departmentName),
                text: this.generateWelcomeTextTemplate(name, departmentName),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Welcome email sent to ${email}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "welcome",
            };
        } catch (error) {
            console.error("Welcome email sending error:", error);
            // Don't throw error for welcome email as it's not critical
            return {
                success: false,
                error: error.message,
                type: "welcome",
            };
        }
    }

    /**
     * Send password change notification
     */
    async sendPasswordChangeNotification(email, name, timestamp, ipAddress) {
        try {
            const mailOptions = {
                from: {
                    name: "PC Department - Kanban System",
                    address: process.env.EMAIL_USER,
                },
                to: email,
                subject: "Security Alert - Password Changed",
                html: this.generatePasswordChangeNotificationTemplate(
                    name,
                    timestamp,
                    ipAddress
                ),
                text: this.generatePasswordChangeTextTemplate(
                    name,
                    timestamp,
                    ipAddress
                ),
            };

            const result = await this.transporter.sendMail(mailOptions);

            console.log(
                `Password change notification sent to ${email}, MessageID: ${result.messageId}`
            );

            return {
                success: true,
                messageId: result.messageId,
                type: "password_change_notification",
            };
        } catch (error) {
            console.error("Password change notification error:", error);
            // Don't throw error as it's a notification
            return {
                success: false,
                error: error.message,
                type: "password_change_notification",
            };
        }
    }

    /**
     * Generate HTML template for password reset OTP email
     */
    generateOTPEmailTemplate(otp, name) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Verification</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e0e0e0;
                }
                .header {
                    text-align: center;
                    color: #2c3e50;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #3498db;
                    margin-bottom: 10px;
                }
                .otp-code {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    font-size: 36px;
                    font-weight: bold;
                    text-align: center;
                    padding: 25px;
                    margin: 30px 0;
                    border-radius: 10px;
                    letter-spacing: 8px;
                    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
                }
                .warning {
                    background: #fff8e1;
                    border-left: 4px solid #ffa726;
                    color: #e65100;
                    padding: 20px;
                    border-radius: 5px;
                    margin: 25px 0;
                }
                .info-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
            
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
                .btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #3498db;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 10px 0;
                }
                ul {
                    padding-left: 20px;
                }
                li {
                    margin: 8px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🔐 Kanban System</div>
                    <h1>Password Reset Request</h1>
                </div>
                
                <p>Hello <strong>${name}</strong>,</p>
                
                <p>You have requested to reset your password for your Kanban System account. Use the verification code below to proceed with your password reset:</p>
                
                <div class="otp-code">
                    ${otp}
                </div>
                
                <div class="info-box">
                    <strong>📋 Instructions:</strong>
                    <ul>
                        <li>Enter this code on the password reset page</li>
                        <li>Complete the process within 10 minutes</li>
                        <li>Create a strong new password</li>
                    </ul>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                        <li>This code will expire in <strong>10 minutes</strong></li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>For security, we recommend changing your password regularly</li>
                        <li>Contact support if you suspect unauthorized access</li>
                    </ul>
                </div>
                
                <p>If you have any questions or concerns, please contact our support team immediately.</p>
                
                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate text template for password reset OTP email (fallback)
     */
    generateOTPTextTemplate(otp, name) {
        return `
Kanban System - Password Reset Request

Hello ${name},

You have requested to reset your password for your Kanban System account.

Your verification code is: ${otp}

IMPORTANT SECURITY INFORMATION:
- This code will expire in 10 minutes
- Do not share this code with anyone
- If you didn't request this, please ignore this email
- Contact support if you suspect unauthorized access

If you have any questions, please contact our support team.

Kanban System - PC Department
This is an automated security message.
        `;
    }

    /**
     * Generate HTML template for email verification
     */
    generateEmailVerificationTemplate(name, otp) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e0e0e0;
                }
                .header {
                    text-align: center;
                    color: #27ae60;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #27ae60;
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #27ae60;
                    margin-bottom: 10px;
                }
                .otp-code {
                    background: linear-gradient(135deg, #27ae60, #219a52);
                    color: white;
                    font-size: 36px;
                    font-weight: bold;
                    text-align: center;
                    padding: 25px;
                    margin: 30px 0;
                    border-radius: 10px;
                    letter-spacing: 8px;
                    box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
                }
                .info-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #27ae60;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
            
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">✅ Kanban System</div>
                    <h1>Email Verification</h1>
                </div>
                
                <p>Hello <strong>${name}</strong>,</p>
                
                <p>Welcome to the Kanban System! Please verify your email address using the code below:</p>
                
                <div class="otp-code">
                    ${otp}
                </div>
                
                <div class="info-box">
                    <strong>📋 Next Steps:</strong>
                    <ul>
                        <li>Enter this code on the email verification page</li>
                        <li>Complete verification within 10 minutes</li>
                        <li>Start using your Kanban System account</li>
                    </ul>
                </div>
                
                <p>After verification, you'll have full access to all Kanban System features.</p>
                
                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate text template for email verification
     */
    generateEmailVerificationTextTemplate(otp, name) {
        return `
Kanban System - Email Verification

Hello ${name},

Welcome to the Kanban System! Please verify your email address.

Your verification code is: ${otp}

This code will expire in 10 minutes.

After verification, you'll have full access to all Kanban System features.

Kanban System - PC Department
        `;
    }

    generateEmailVerifiedTemplate(name, departmentName) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Successfully Verified</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            background-color: #f8f9fa;
        }

        .container {
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            text-align: center;
            color: #27ae60;
            margin-bottom: 30px;
            border-bottom: 3px solid #27ae60;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            line-height: 1.8;
            color: #5a6c7d;
            margin-bottom: 30px;
        }

        .status-card {
            background: linear-gradient(135deg, #e8f4fd, #d6efff);
            border: 1px solid #3498db;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }

        .status-card h3 {
            color: #2980b9;
            margin-bottom: 10px;
            font-size: 18px;
        }

        .status-card p {
            color: #34495e;
            font-size: 14px;
        }

        .info-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }

        .info-box h4 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 16px;
            display: flex;
            align-items: center;
        }

        .info-box ul {
            color: #856404;
            margin-left: 20px;
            font-size: 14px;
        }

        .info-box li {
            margin-bottom: 5px;
        }

        .footer {
            background-color: #2c3e50;
            color: #ecf0f1;
            text-align: center;
            padding: 30px;
        }

        .footer p {
            font-size: 14px;
            margin-bottom: 10px;
        }

        .footer .company-name {
            font-weight: bold;
            color: #3498db;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Kanban System</h1>
            <p>Email Verified</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">
                Hello <strong>${name}</strong> from ${departmentName},
            </div>

            <!-- Main Message -->
            <div class="message">
                Your email has been successfully verified. Please wait while the admin reviews your account.
            </div>

            <!-- Status Card -->
            <div class="status-card">
                <h3>📋 Your Registration Status</h3>
                <p><strong>Email:</strong> ✅ Verified</p>
                <p><strong>Account Activation:</strong> ⏳ Waiting for Admin Review</p>
            </div>

            <!-- Info Box -->
            <div class="info-box">
                <h4>ℹ️  Important Information</h4>
                <ul>
                    <li>Your registration has been entered into the system</li>
                    <li>The admin team will review it within 1–3 business days</li>
                    <li>You will receive a notification email after the review is complete</li>
                    <li>Make sure your email remains active to receive updates</li>
                </ul>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>This email was sent automatically. Please do not reply.</p>
                <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                <p>PT. Automotive Fasteners Aoyama Indonesia</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
    }

    /**
     * Generate HTML template for registration email verification
     */
    generateRegistrationRejectTemplate(rejectionReason, name) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Email Verification</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #e74c3c;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #e74c3c;
                    padding-bottom: 20px;
                }
                .rejection-box {
                    background: #fdeded;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .reason-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #e74c3c;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 Registration Status Update</h1>
                </div>
                
                <p>Hello <strong>${name}</strong>,</p>
                
                <div class="rejection-box">
                    <h3>❌ Registration Not Approved</h3>
                    <p>We regret to inform you that your employee registration for the Kanban System has not been approved at this time.</p>
                </div>
                
                <div class="reason-box">
                    <h4>Reason for rejection:</h4>
                    <p><strong>${rejectionReason}</strong></p>
                </div>
                
                <h4>What happens next?</h4>
                <ul>
                    <li>Please review the rejection reason above</li>
                    <li>Contact the PC Department if you believe this is an error</li>
                    <li>If eligible, you may submit a new registration in the future</li>
                </ul>
                
                <p>If you have any questions about this decision or need clarification, please contact the PC Department.</p>
                
                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateRegistrationRejectTextTemplate(rejectionReason, name) {
        return `
Registration Status Update

Hello ${name},

We regret to inform you that your employee registration for the Kanban System has not been approved at this time.

Reason for rejection: ${rejectionReason}

What happens next?
- Please review the rejection reason above
- Contact the PC Department if you believe this is an error
- If eligible, you may submit a new registration in the future

If you have any questions about this decision, please contact the PC Department.

Kanban System - PC Department
        `;
    }

    /**
     * Generate admin notification template
     */
    generateAdminNotificationTemplate(adminName, registrationData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Registration Pending Approval</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #f39c12;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #f39c12;
                    padding-bottom: 20px;
                }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .info-table td {
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                }
                .info-table td:first-child {
                    font-weight: bold;
                    width: 40%;
                    background: #f8f9fa;
                }
                .action-box {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
            
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Registration Pending</h1>
                </div>
                
                <p>Hello <strong>${adminName}</strong></p>
                <p>A new employee registration has been submitted and requires your review.</p>
                
                <table class="info-table">
                    <tr>
                        <td>Name:</td>
                        <td>${registrationData.name}</td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>${registrationData.email}</td>
                    </tr>
                    <tr>
                        <td>Employee ID:</td>
                        <td>${registrationData.employee_id}</td>
                    </tr>
                    <tr>
                        <td>Position:</td>
                        <td>${registrationData.position}</td>
                    </tr>
                    <tr>
                        <td>Department:</td>
                        <td>${registrationData.department.name}</td>
                    </tr>
                    <tr>
                        <td>Division:</td>
                        <td>${registrationData.division || "Not specified"}</td>
                    </tr>
                    <tr>
                        <td>Work Location:</td>
                        <td>${
                            registrationData.work_location || "Not specified"
                        }</td>
                    </tr>
                    <tr>
                        <td>Phone:</td>
                        <td>${registrationData.no_hp}</td>
                    </tr>
                    <tr>
                        <td>Registration Date:</td>
                        <td>${new Date(
                            registrationData.created_at
                        ).toLocaleString()}</td>
                    </tr>
                </table>
                
                <div class="action-box">
                    <h4>⚡ Action Required</h4>
                    <p>Please log in to the admin panel to review and approve or reject this registration.</p>
                    <ul>
                        <li>Verify employee information</li>
                        <li>Confirm department authorization</li>
                        <li>Check employee ID validity</li>
                        <li>Approve or reject with reason</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateAdminNotificationTextTemplate(registrationData) {
        return `
New Registration Pending Approval

A new employee registration has been submitted and requires your review.

Registration Details:
- Name: ${registrationData.name}
- Email: ${registrationData.email}
- Employee ID: ${registrationData.employee_id}
- Position: ${registrationData.position}
- Department: ${registrationData.department}
- Division: ${registrationData.division || "Not specified"}
- Work Location: ${registrationData.work_location || "Not specified"}
- Phone: ${registrationData.no_hp}
- Registration Date: ${new Date(registrationData.created_at).toLocaleString()}

Action Required:
Please log in to the admin panel to review and approve or reject this registration.

Kanban System - Admin Notification
        `;
    }

    /**
     * Generate welcome email template
     */
    generateWelcomeEmailTemplate(name, departmentName) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Kanban System</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #3498db;
                    margin-bottom: 30px;
                }
                .welcome-badge {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
            
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to Kanban System!</h1>
                </div>
                
                <div class="welcome-badge">
                    <h2>Welcome ${name}!</h2>
                    <p>Department: ${departmentName}</p>
                </div>
                
                <p>Your account has been successfully created and verified. You can now access all the features of our Kanban management system.</p>
                
                <p>Start managing your workflow efficiently with our comprehensive Kanban board system.</p>

                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate welcome text template
     */
    generateWelcomeTextTemplate(name, departmentName) {
        return `
Welcome to Kanban System!

Hello ${name},

Your account has been successfully created and verified.
Department: ${departmentName}

You can now access all the features of our Kanban management system.

Kanban System - PC Department
        `;
    }

    /**
     * Generate password change notification template
     */
    generatePasswordChangeNotificationTemplate(name, timestamp, ipAddress) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Security Alert - Password Changed</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .alert-header {
                    background: #e74c3c;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .info-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #e74c3c;
                }
                .footer {
                    background-color: #2c3e50;
                    color: #ecf0f1;
                    text-align: center;
                    padding: 30px;
                }
            
                .footer p {
                    font-size: 14px;
                    margin-bottom: 10px;
                }
            
                .footer .company-name {
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="alert-header">
                    <h1>🔒 Security Alert</h1>
                    <p>Your password has been changed</p>
                </div>
                
                <p>Hello <strong>${name}</strong>,</p>
                
                <p>This is a security notification that your password has been successfully changed.</p>
                
                <div class="info-box">
                    <strong>Change Details:</strong>
                    <ul>
                        <li>Time: ${timestamp}</li>
                        <li>IP Address: ${ipAddress}</li>
                    </ul>
                </div>
                
                <p>If you did not make this change, please contact our support team immediately.</p>

                <div class="footer">
                    <p>This email was sent automatically. Please do not reply.</p>
                    <p>© ${new Date().getFullYear()} <span class="company-name">Production Control Department </span>. All rights reserved.</p>
                    <p>PT. Automotive Fasteners Aoyama Indonesia</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Generate password change text template
     */
    generatePasswordChangeTextTemplate(name, timestamp, ipAddress) {
        return `
Security Alert - Password Changed

Hello ${name},

Your password has been successfully changed.

Change Details:
- Time: ${timestamp}
- IP Address: ${ipAddress}

If you did not make this change, please contact support immediately.

Kanban System - PC Department
        `;
    }

    /**
     * Test email configuration
     */
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ Email service is ready and configured correctly");
            return { success: true, message: "Email service is ready" };
        } catch (error) {
            console.error(
                "❌ Email service configuration error:",
                error.message
            );
            return {
                success: false,
                message: `Email service error: ${error.message}`,
            };
        }
    }

    /**
     * Send bulk emails (for future notifications)
     */
    async sendBulkEmails(emails, subject, htmlTemplate, textTemplate) {
        try {
            const results = [];

            // Send emails in batches to avoid overwhelming the server
            const batchSize = 10;
            for (let i = 0; i < emails.length; i += batchSize) {
                const batch = emails.slice(i, i + batchSize);
                const batchPromises = batch.map(async (emailData) => {
                    try {
                        const mailOptions = {
                            from: {
                                name: "PC Department - Kanban System",
                                address: process.env.EMAIL_USER,
                            },
                            to: emailData.email,
                            subject: subject,
                            html: htmlTemplate.replace(
                                /{{(\w+)}}/g,
                                (match, key) => emailData[key] || ""
                            ),
                            text: textTemplate.replace(
                                /{{(\w+)}}/g,
                                (match, key) => emailData[key] || ""
                            ),
                        };

                        const result = await this.transporter.sendMail(
                            mailOptions
                        );
                        return {
                            email: emailData.email,
                            success: true,
                            messageId: result.messageId,
                        };
                    } catch (error) {
                        return {
                            email: emailData.email,
                            success: false,
                            error: error.message,
                        };
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);

                // Add delay between batches to avoid rate limiting
                if (i + batchSize < emails.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }

            const successCount = results.filter((r) => r.success).length;
            const failureCount = results.filter((r) => !r.success).length;

            console.log(
                `Bulk email sent: ${successCount} successful, ${failureCount} failed`
            );

            return {
                success: true,
                results: results,
                summary: {
                    total: emails.length,
                    successful: successCount,
                    failed: failureCount,
                },
            };
        } catch (error) {
            console.error("Bulk email sending error:", error);
            throw new Error(`Failed to send bulk emails: ${error.message}`);
        }
    }

    /**
     * Close transporter connection
     */
    async close() {
        try {
            this.transporter.close();
            console.log("Email service connection closed");
        } catch (error) {
            console.error("Error closing email service:", error);
        }
    }
}

module.exports = new EmailService();
