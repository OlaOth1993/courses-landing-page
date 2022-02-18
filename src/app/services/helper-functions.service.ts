import { Injectable } from '@angular/core';
import { concat } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HelperFunctionsService {

    //#region Time

    /**
    * 
    * @param time12 time in 12 Hour H:i [AM|PM]
    * @returns time in 24 hour
    */
    convert12to24Hour(time12: string): string {
        const [time, modifier] = time12.split(' ');

        let [hours, minutes] = time.split(':');

        if (modifier == "AM") {
            if (parseInt(hours, 10) == 12) hours = "0";
        }
        else {
            if (parseInt(hours, 10) < 12) hours = (parseInt(hours, 10) + 12).toString();
        }
        let time24 = '';

        if (parseInt(hours, 10) < 10)
            time24 = '0';

        time24 += parseInt(hours, 10) + ':' + minutes;
        return time24;
    }

    convert24to12(time24: string): string {
        var modifier = 'AM';
        let [hours, minutes] = time24.split(':');
        var numHour = +hours;
        if (numHour >= 12) {
            if (numHour != 12) numHour -= 12;
            modifier = 'PM';
        }
        var zero = "";
        if (numHour <= 9) zero = "0";
        return zero + numHour.toString() + ":" + minutes + " " + modifier;
    }

    /**
    * 
    * @param time1 time in format H:i
    * @param time2 time in format H:i
    * @returns difference bettween times in minutes
    */
    diffTime(time1: string, time2: string): number {
        var [hour, minutes] = time1.split(':');
        var [hour2, minutes2] = time2.split(':');
        var diffHour = Math.abs(+hour - +hour2) * 60;
        var diffminutes = Math.abs(+minutes - +minutes2);
        return diffHour + diffminutes;
    }

    //#endregion

    //#region Date 

    /**
         * 
         * @param d1 first date
         * @param d2 second date
         * @returns difference bettween dates in months 
         */
    monthDiff(d1: Date, d2: Date): number {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    /**
     * 
     * @param start start date 
     * @param end  end date
     * @returns weeks bettween them 
     */
    getDays(start: Date, end: Date): [string] {
        var weekDaysList: [string] = [''];
        var numDay = 0;
        var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = start;
        while (d <= end) {
            if (++numDay > 7) break;
            weekDaysList.push(DAYS[d.getDay()])
            d.setDate(d.getDate() + 1)
        }
        weekDaysList.splice(0, 1)
        return weekDaysList;
    }

    /**
     * 
     * @param date 
     * @returns date in format Y-m-d H:i:s
     */
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = "23",
            minutes = "59",
            seconds = "59";

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-') + " " + [hour, minutes, seconds].join(':');
    }

    /**
     * 
     * @param date1 first date
     * @param date2 second date
     * @returns -1 if date 1 is less than date2 || 1  if date 1 is bigger than date2 || 0  if date 1 is equal than date2
     */
    compareDates(date1: Date, date2: Date): number {
        if (date1.getFullYear() < date2.getFullYear() || (date1.getFullYear() == date2.getFullYear() && date1.getMonth() < date2.getMonth()) || (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() < date2.getDate()))
            return -1
        if (date1.getFullYear() > date2.getFullYear() || (date1.getFullYear() == date2.getFullYear() && date1.getMonth() > date2.getMonth()) || (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() > date2.getDate()))
            return 1;
        return 0;
    }

    //#endregion

    //#region File

    /**
     * 
     * @param fileName path of file
     * @returns extension of path
     */
    getExtension(fileName: string) {
        var parts = fileName.split('.');
        return parts[parts.length - 1];
    }


    /**
     * 
     * @param file send file type file 
     * @returns true if its image or not 
     */
    isImg(file) {
        switch (this.getExtension(file)) {
            case 'jpeg':
            case 'jpg':
            case 'png':
                return true;
        }
        return false;
    }

    //#endregion

}
