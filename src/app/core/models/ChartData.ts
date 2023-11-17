/*
example of an ChartData:
{
    id: 1,
    label: "Italy",
    participations: []
}
*/

import {Participation} from "src/app/core/models/Participation";

export interface ChartData {
    id: number;
    label:string;
    data: Participation[];
  }
