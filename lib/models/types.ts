import { Timestamp } from 'firebase/firestore';

export interface ShopConfig {
    timezone: string;
    currency: string;
    bookingRules: {
        slotMinutes: number;
        minNoticeMinutes: number;
        cancelNoticeMinutes: number;
        maxDaysAhead: number;
        maxBookingsPerHourPerIp: number;
        alignToSlot: boolean;
    };
    limits: {
        maxBarbers: number;
    };
}

export interface Service {
    id: string;
    name: string;
    baseDurationMin: number;
    price: number;
    serviceCost: number;
    isActive: boolean;
}

export interface Barber {
    id: string;
    displayName: string;
    isActive: boolean;
    order: number;
    workingHours: {
        [key: string]: { start: string; end: string; } | null; // e.g., "mon": { start: "09:00", end: "18:00" }
    };
    serviceOverrides?: {
        [serviceId: string]: { durationMin: number; };
    };
    commission: {
        type: "percentage" | "fixed";
        value: number;
        includeTips: boolean;
    };
}

export interface Appointment {
    id?: string;
    createdFrom: "public" | "internal";
    status: "pending" | "confirmed" | "cancelled" | "no_show" | "done";
    startAt: Timestamp | Date;
    endAt: Timestamp | Date;
    dateKey: string; // "YYYY-MM-DD"
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    durationMin: number;
    pricing: {
        basePrice: number;
        discount?: number;
        finalPrice: number;
    };
    costing: {
        serviceCost: number;
    };
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    cancelTokenHash?: string;
    reminder?: { sent24h: boolean; };
    createdAt?: Timestamp | Date;
}

export interface Payment {
    id?: string;
    appointmentId: string;
    dateKey: string;
    barberId: string;
    barberName: string;
    method: "cash" | "card" | "transfer";
    amount: number;
    tip?: number;
    discount?: number;
    commission: {
        type: "percentage" | "fixed";
        value: number;
        commissionBase: number;
        commissionAmount: number;
    };
    businessAmount: number;
    costing: {
        serviceCost: number;
        profitGross: number;
        profitNet: number;
    };
    createdAt?: Timestamp | Date;
    createdBy: string;
}

export interface DailyStats {
    revenue: { net: number; tips: number; discounts: number; gross: number; };
    commissions: { total: number; };
    costs: { services: number; };
    profit: { net: number; };
    paymentMethods: { cash: number; card: number; transfer: number; };
    appointments: { done: number; };
    updatedAt?: Timestamp | Date;
}

export interface BarberDailyStats {
    barberId: string;
    barberName: string;
    dateKey: string;
    doneCount: number;
    revenueNet: number;
    tips: number;
    commissionTotal: number;
    businessTotal: number;
    serviceCostTotal: number;
    profitNet: number;
    updatedAt?: Timestamp | Date;
}
