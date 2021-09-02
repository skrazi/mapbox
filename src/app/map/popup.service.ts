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
      `<table id="marker-table">`+
        `<tr><td class="name">Bently Priority Score (BPS)</td><td class="value"> ${ data.bps } </td></tr>`+
        `<tr><td class="name">Unacknowledged</td><td class="value"> ${ data.unacknowledged } </td></tr>`+
        `<tr><td class="name">Machine Alarms</td><td class="value"> ${ data.machineAlarms } </td></tr>`+
        `<tr><td class="name">Open Cases</td><td class="value"> ${ data.openCases } </td></tr>`+
      `</table>`+
    `</div>`;
  }

  makePopupForCluster(list): string {
    var table = '' +  
    `<div class="popup">`+
    `<strong class="heading">Number of assets: ${ list.length } </strong>` +
    `<table id="cluster-table">`+
    `<tr><th>Id</th><th>Site Name</th><th>Alarms</th><th>AlertType</th></tr>`;

    for(let i = 0; i < list.length; i++) {
      
      let color = "";
      if (list[i].properties.alertType === "L4") {
        color = "#ff0000";
      } else if (list[i].properties.alertType === "L3") {
        color = "#ffff00";
      } else if (list[i].properties.alertType === "L2") {
        color = "#ff9900";
      } else if (list[i].properties.alertType === "L1") {
        color = "#d2a679";
      }

      const row = 
      `<tr>` +
        `<td id="site-id">` +
          `${ list[i].properties.siteId }` +
        `</td>`+
        `<td id="Description">` +
          `${ list[i].properties.description }` +
        `</td>`+
        `<td id="alarms">` +
          `${ list[i].properties.alarms } `+ 
        `</td>` +
        `<td id="alert-type" style="background:${color};">` +
        `${ list[i].properties.alertType } `+ 
        `</td>` +
      `</tr>`;

      table += row;
    }

    table += `</table>`+
    `</div>`;

    return table;
  }
}
