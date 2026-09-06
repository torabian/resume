import { WalletEventDto } from "./sdk/WalletEventDto";
import { strings } from "./strings/translations";

export const columns = (t: typeof strings) => [
  {
    name: WalletEventDto.Fields.eventType,
    title: t.walletEvents.eventType,
    width: 220,
  },
  {
    name: WalletEventDto.Fields.externalEventId,
    title: t.walletEvents.externalEventId,
    width: 220,
  },
  {
    name: WalletEventDto.Fields.processed,
    title: t.walletEvents.processed,
    width: 100,
  },
  {
    name: WalletEventDto.Fields.processingError,
    title: t.walletEvents.processingError,
    width: 200,
  },
  {
    name: WalletEventDto.Fields.receivedAt,
    title: t.walletEvents.receivedAt,
    width: 180,
  },
];
