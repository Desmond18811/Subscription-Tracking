import {Router} from "express";
import authorize from "../Middleware/auth.middleware.js";
import {
    cancelSubscription,
    createSubscription,
    getAllSubscriptions,
    getSubscriptionDetails,
    getUserSubscriptions, updateSubscription
} from "../Controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', authorize,getAllSubscriptions)

subscriptionRouter.get('/:id', authorize,getSubscriptionDetails)

subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id',updateSubscription)

subscriptionRouter.delete('/:id', (req, res) =>{res.send({     title: 'DELETE SUBSCRIPTION' })})

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', cancelSubscription)

subscriptionRouter.get('/upcoming-renewals', (req, res) =>{res.send({     title: 'GET ALL UPCOMING SUBSCRIPTIONS' })})

export default subscriptionRouter;