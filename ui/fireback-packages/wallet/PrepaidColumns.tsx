import { PrepaidDto } from "./sdk/PrepaidDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: PrepaidDto.Fields.amount,
    title: t.prepaids.amount,
    width: 120,
  },
  {
    name: PrepaidDto.Fields.currency,
    title: t.prepaids.currency,
    width: 100,
  },
  {
    name: PrepaidDto.Fields.redeemKey,
    title: t.prepaids.redeemKey,
    width: 260,
  },
  {
    name: PrepaidDto.Fields.status,
    title: t.prepaids.status,
    width: 110,
  },
  {
    name: PrepaidDto.Fields.workspaceId,
    title: t.prepaids.workspaceId,
    width: 160,
  },
];
