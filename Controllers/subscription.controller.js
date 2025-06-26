import Subscription from "../Models/subscription.model.js"; // Fixed typo in filename
import { workflowClient } from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";


export const createSubscription = async (req, res, next) => {
    try {
        // 1. Create subscription with user reference
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        // 2. Trigger reminder workflow
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id, // Use _id instead of id
            },
            headers: { // Fixed property name and content type
                'Content-Type': 'application/json'
            },
            retries: 0
        });

        // 3. Send success response
        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription,
            workflowRunId // Include workflow ID in response
        });

    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Authorization check
        if (req.user._id.toString() !== req.params.id) { // Compare string representations
            const error = new Error("Unauthorized access");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            message: "User subscriptions retrieved successfully",
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getAllSubscriptions = async (req, res, next) => {
    try {
        // Admin check
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const subscriptions = await Subscription.find();
        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this subscription"
            });
        }

        res.status(200).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        let subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this subscription"
            });
        }

        subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Subscription updated",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Ownership check
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this subscription"
            });
        }

        // Update status
        subscription.status = 'inactive';
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};
