import { Appointment } from './models/types';
import { globalConfig } from './config';

export function getWhatsAppBookingLink(phone: string, text: string) {
    // Cleans the phone number to numbers only
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildSuccessMessage(appointment: Appointment, cancelUrl: string): string {
    return `¡Hola! Confirmo mi reserva en ${globalConfig.siteName} 💈\n\n📌 *Servicio:* ${appointment.serviceName}\n✂️ *Barbero:* ${appointment.barberName}\n📅 *Fecha:* ${appointment.dateKey}\n⏰ *Hora:* ${typeof appointment.startAt === 'object' && 'toDate' in appointment.startAt ? appointment.startAt.toDate().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) : appointment.startAt}\n\nEn caso de no poder asistir, podés cancelar desde aquí:\n${cancelUrl}`;
}
