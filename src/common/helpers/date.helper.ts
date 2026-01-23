import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateHelper {
  static checkExpiration(expiresIn: Date): boolean {
    const now = dayjs().utc();
    const expire = dayjs(expiresIn).utc();

    return now.isAfter(expire);
  }

  static diff(from: Date, to: Date, unit: dayjs.ManipulateType): number {
    const f = dayjs.utc(from);
    const t = dayjs.utc(to);

    return t.diff(f, unit);
  }

  static getDate(date: string): Date {
    return dayjs.utc(date).toDate();
  }

  static getCurrentDate(): Date {
    return dayjs.utc().toDate();
  }

  static add(
    date: string | Date,
    amount: number,
    unit: dayjs.ManipulateType,
  ): Date {
    return dayjs.utc(date).add(amount, unit).millisecond(0).toDate();
  }

  static formatDateAndTime(date: Date): { date: string; time: string } {
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    const formattedTime = dayjs(date).format('hh:mm A');
    return { date: formattedDate, time: formattedTime };
  }
}
