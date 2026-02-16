"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    configService;
    transporter;
    logger = new common_1.Logger(MailService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        await this.createTransporter();
    }
    async createTransporter() {
        const host = this.configService.get('SMTP_HOST');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host: this.configService.get('SMTP_HOST'),
                port: this.configService.get('SMTP_PORT'),
                secure: this.configService.get('SMTP_PORT') === 465,
                auth: {
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASS'),
                },
            });
        }
        else {
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
    async sendRegistrationConfirmation(user) {
        const manualLink = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/login`;
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
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                this.logger.log(`Preview URL: ${previewUrl}`);
            }
        }
        catch (error) {
            this.logger.error('Error sending registration email', error);
        }
    }
    async sendAccountValidation(user) {
        const dashboardLink = `${this.configService.get('FRONTEND_URL') || 'http://localhost:5173'}/dashboard`;
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
        }
        catch (error) {
            this.logger.error('Error sending validation email', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map