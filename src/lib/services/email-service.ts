/**
 * Institutional Email Service for Today Decode
 * Handles automated risk alerts and strategic research.
 */

const SITE_URL = "https://todaydecode.com";

interface EmailPayload {
    to: string;
    subject: string;
    content: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const emailService = {
    /**
     * Send a critical risk alert based on user watchlists
     */
    async sendRiskAlert(payload: EmailPayload) {
        console.log(`[EmailService] Dispatching CRITICAL alert to: ${payload.to}`);
        console.log(`[EmailService] Subject: ${payload.subject}`);

        // In production, integrate Resend or SendGrid
        return { success: true, timestamp: new Date().toISOString() };
    },

    /**
     * Institutional Watchlist Alert
     * Logic for notifying users of new analysis in their followed silos.
     */
    async sendWatchlistAlert(userEmail: string, articleTitle: string, categoryPath: string, articleSlug: string) {
        // Enforce trailing slash to ensure link integrity
        const cleanPath = categoryPath.replace(/^\/|\/$/g, '');
        const articleUrl = `${SITE_URL}/${cleanPath}/${articleSlug}/`;

        console.log(`[EmailService] Pulse Alert for ${userEmail}: New strategic analysis available.`);
        console.log(`[EmailService] Artifact: ${articleTitle}`);
        console.log(`[EmailService] Access Point: ${articleUrl}`);

        return {
            success: true,
            deliveryPoint: articleUrl
        };
    },

    /**
     * Signup for "The Pulse"
     */
    async registerSubscriber(email: string, regions: string[]) {
        console.log(`[EmailService] Registering new analyst: ${email} for regions: ${regions.join(', ')}`);
        return { success: true };
    }
};
