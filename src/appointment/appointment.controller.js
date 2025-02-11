import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    }); 
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user: userId }).populate("pet");
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false,
       message: "Error al obtener las citas", error });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedData = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, updatedData, { new: true });
    if (!appointment) {
      return res.status(404).json({ success: false, 
        message: "Cita no encontrada" });
    }
    return res.status(200).json({ success: true, 
      message: "Cita actualizada", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, 
      message: "Error al actualizar la cita", error });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, 
        message: "Cita no encontrada" });
    }
    return res.status(200).json({ success: true, 
      message: "Cita cancelada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, 
      message: "Error al cancelar la cita", error });
  }
};
