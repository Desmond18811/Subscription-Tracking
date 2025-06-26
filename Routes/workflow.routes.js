import { Router} from "express";
import {sendReminders} from "../Controllers/workflows.controller.js";

const workflowRouter = Router();

workflowRouter.get("/", sendReminders)


export default workflowRouter