import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  makePopup(data): string {
    return ``+
    `<div class="popup">`+
      `<strong class="heading"> ${ data.siteName } </strong>` +
      `<table>`+
        `<tr><td class="name">Bently Priority Score (BPS)</td><td class="value"> ${ data.bps } </td></tr>`+
        `<tr><td class="name">Unacknowledged</td><td class="value"> ${ data.unacknowledged } </td></tr>`+
        `<tr><td class="name">Machine Alarms</td><td class="value"> ${ data.machineAlarms } </td></tr>`+
        `<tr><td class="name">Open Cases</td><td class="value"> ${ data.openCases } </td></tr>`+
      `</table>`+
    `</div>`;
  }
}
