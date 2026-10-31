import { Injectable } from '@angular/core';
import moment from 'moment-timezone';

export interface IcsEventOptions {
  title: string;
  description?: string;
  location?: string;
  date: string;
  time: string;
  durationMinutes?: number;
  reminderMinutesBefore?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class CalendarReminder {
  downloadIcs(options: IcsEventOptions): void {
    const icsContent = this.buildIcsContent(options);
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.slugify(options.title)}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  buildIcsContent(options: IcsEventOptions): string {
    const {
      title,
      description = '',
      location = '',
      date,
      time,
      durationMinutes = 30,
      reminderMinutesBefore = [1440, 60, 10],
    } = options;
    const start = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const end = start.clone().add(durationMinutes, 'minutes');
    const now = moment().utc().format('YYYYMMDDTHHmmss') + 'Z';
    const uid = `${Date.now()}@care-way.app`;
    const alarmBlocks = reminderMinutesBefore.flatMap((minutesBefore) => [
      'BEGIN:VALARM',
      `TRIGGER:${this.toTrigger(minutesBefore)}`,
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${this.escapeText(title)}`,
      'END:VALARM',
    ]);
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YourApp//Appointment Reminder//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${start.utc().format('YYYYMMDDTHHmmss')}Z`,
      `DTEND:${end.utc().format('YYYYMMDDTHHmmss')}Z`,
      `SUMMARY:${this.escapeText(title)}`,
      ...(description ? [`DESCRIPTION:${this.escapeText(description)}`] : []),
      ...(location ? [`LOCATION:${this.escapeText(location)}`] : []),
      'STATUS:CONFIRMED',
      ...alarmBlocks,
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    return lines.join('\r\n') + '\r\n';
  }

  toTrigger(minutesBefore: number): string {
    if (minutesBefore % 1440 === 0) {
      const days = minutesBefore / 1440;
      return `-P${days}D`;
    }
    if (minutesBefore % 60 === 0) {
      const hours = minutesBefore / 60;
      return `-PT${hours}H`;
    }
    return `-PT${minutesBefore}M`;
  }

  escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
