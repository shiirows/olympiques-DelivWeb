/*
example of an Heading:
{
    title: "Medals per country",
    participations: []
}
*/

import { HeadingItem } from "./HeadingItem";

export interface Heading {
    title: string;
    items: HeadingItem[];
  }
  
