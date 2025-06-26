import { createRequire } from 'module';
import Subscription from "../Models/subscription.model.js"; // Fixed typo in filename
import dayjs from 'dayjs';
import {sendReminderEmail} from "../utils/send-emails.js";

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 2, 1]; // Days before renewal to send reminders

export const sendReminders = serve(async (context) => {
    try {
        // 1. Extract subscription ID from payload
        const { subscriptionId } = context.requestPayload;

        // 2. Fetch subscription with user's email
        const subscription = await fetchSubscription(context, subscriptionId);

        // 3. Validate subscription
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        if (subscription.status !== 'active') {
            throw new Error('Subscription is not active');
        }

        const renewalDate = dayjs(subscription.renewalDate);

        // 4. Check if already expired
        if (renewalDate.isBefore(dayjs())) {
            throw new Error('Subscription has already expired');
        }

        // 5. Schedule reminders
        for (const daysBefore of REMINDERS) {
            const reminderDate = renewalDate.subtract(daysBefore, 'day');

            // Only schedule future reminders
            if (reminderDate.isAfter(dayjs())) {
                await sleepUntil(context, reminderDate, `${daysBefore} days before renewal`);
            }

            // Trigger the actual reminder
            await triggerReminder(
                context,
                `Your subscription renews in ${daysBefore} days`,
                subscription
            );
        }

        return { success: true, message: "Reminders scheduled successfully" };

    } catch (error) {
        console.error("Error in sendReminders:", error);
        throw error; // Rethrow for workflow to handle
    }
});

// Helper function to fetch subscription with user email
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'email');
    });
};

// Helper function to sleep until reminder date
const sleepUntil = async (context, date, label) => {
    console.log(`Sleeping until ${date.toISOString()} for ${label}`);
    await context.sleepUntil(date.toDate(), label);
};

// Helper function to trigger actual reminder
// Helper function to trigger actual reminder
const triggerReminder = async (context, daysBefore, subscription) => {
    return await context.run(`send-reminder`, async () => {
        try {
            const emailType = `${daysBefore} days before reminder`;
            console.log(`Sending ${emailType} to ${subscription.user.email}`);

            await sendReminderEmail({
                to: subscription.user.email,
                type: emailType,
                subscription: {
                    user: subscription.user,
                    name: subscription.name,
                    renewalDate: subscription.renewalDate,
                    price: subscription.price,
                    currency: subscription.currency,
                    frequency: subscription.frequency,
                    paymentMethod: subscription.paymentMethod
                }
            });

            return { success: true };
        } catch (error) {
            console.error("Error in triggerReminder:", error);
            throw error;
        }
    });
};
