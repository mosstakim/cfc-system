
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        await this.createTransporter();
    }

    private async createTransporter() {
        const host = this.configService.get<string>('SMTP_HOST');

        if (host) {
            this.transporter = nodemailer.createTransport({
                host: this.configService.get<string>('SMTP_HOST'),
                port: this.configService.get<number>('SMTP_PORT'),
                secure: this.configService.get<number>('SMTP_PORT') === 465,
                auth: {
                    user: this.configService.get<string>('SMTP_USER'),
                    pass: this.configService.get<string>('SMTP_PASS'),
                },
            });
        } else {
            this.logger.log('No SMTP config found, creating Ethereal test account...');
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            this.logger.log(`Ethereal test account created: ${testAccount.user}`);
        }
    }

    async sendRegistrationConfirmation(user: User) {
        const manualLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/login`;

        const mailOptions = {
            from: '"CFC Notifier" <noreply@cfc.com>',
            to: user.email,
            subject: 'Confirmation d\'inscription - CFC',
            html: `
        <h3>Bonjour ${user.firstName} ${user.lastName},</h3>
        <p>Votre inscription au Centre de Formation Continue a été enregistrée avec succès.</p>
        <p>Vous pouvez vous connecter à votre espace personnel pour compléter votre dossier :</p>
        <p><a href="${manualLink}">Accéder à mon espace</a></p>
        <br/>
        <p>Cordialement,</p>
        <p>L'équipe CFC</p>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent: ${info.messageId}`);
            // Log Ethereal URL for development
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                this.logger.log(`Preview URL: ${previewUrl}`);
            }
        } catch (error) {
            this.logger.error('Error sending registration email', error);
        }
    }

    async sendAccountValidation(user: User) {
        const dashboardLink = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/dashboard`;

        const mailOptions = {
            from: '"CFC Notifier" <noreply@cfc.com>',
            to: user.email,
            subject: 'Validation de votre dossier - CFC',
            html: `
        <h3>Félicitations ${user.firstName},</h3>
        <p>Votre dossier d'inscription a été validé par l'administration.</p>
        <p>Vous êtes maintenant officiellement inscrit(e) à la formation choisie.</p>
        <p>Rendez-vous sur votre tableau de bord pour plus d'informations :</p>
        <p><a href="${dashboardLink}">Mon tableau de bord</a></p>
        <br/>
        <p>Cordialement,</p>
        <p>L'équipe CFC</p>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Validation email sent: ${info.messageId}`);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                this.logger.log(`Preview URL: ${previewUrl}`);
            }
        } catch (error) {
            this.logger.error('Error sending validation email', error);
        }
    }
}
