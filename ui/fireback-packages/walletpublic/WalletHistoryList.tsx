import { CommonListManager } from "@fireback/ui-core/components/entity-manager/CommonListManager";
import { buildUdfBrowseQs } from "@fireback/ui-core/hooks/useUdfBrowseQuery";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWalletHistoryActionQuery } from "./sdk/WalletHistoryAction";
import { historyColumns } from "./WalletHistoryColumns";
import { strings } from "./strings/translations";

// Paginated ledger for one wallet (WalletHistoryAction) - walletId is a fixed extra qs
// param on top of the udf's own filter/sort/paging, exactly the pattern
// buildUdfBrowseQs's own doc comment recommends for a queryHook that needs to add its
// own qs beyond what a plain createUdfBrowseQueryHook(...) wrapping gives for free.
export const WalletHistoryList = ({ walletId }: { walletId: string }) => {
  const s = useS(strings);

  return (
    <CommonListManager
      columns={historyColumns(s)}
      queryHook={({ state }: any) => {
        const qs = buildUdfBrowseQs(state.udf);
        qs.set("walletId", walletId);
        return useWalletHistoryActionQuery({ qs: qs as any });
      }}
      help={s.help.walletHistory}
    ></CommonListManager>
  );
};
