import { RegionalContentDto } from "@fireback/messaging/sdk/messaging/RegionalContentDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: "uniqueId",
    title: t.regionalContents.uniqueId,
    width: 200,
  },
  {
    name: RegionalContentDto.Fields.region,
    title: t.regionalContents.region,
    width: 100,
  },
  {
    name: RegionalContentDto.Fields.keyGroup,
    title: t.regionalContents.keyGroup,
    width: 100,
  },
];
