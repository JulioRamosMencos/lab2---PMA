import { Router } from "express";
import { saveAppointment, getAppointments, updateAppointment, cancelAppointment } from "./appointment.controller.js";
import { createAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();


router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.get("/appointments/:userId", getAppointments);
router.put("/appointments/:appointmentId", updateAppointment);
router.delete("/appointments/:appointmentId", cancelAppointment);

export default router;
