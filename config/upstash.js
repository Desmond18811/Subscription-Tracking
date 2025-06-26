import {Client as WorkflowClient} from '@upstash/workflow';

import {QSTASH_TOKEN, QSTASH_URL} from "./env.js";

export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
    // retry: {
    //     maxAttempts: 3,
    //     backoff: {
    //     type: 'exponential',
    //     delay: 1000,
    //     },
    // },
    // timeout: 60000, // 60 seconds
})