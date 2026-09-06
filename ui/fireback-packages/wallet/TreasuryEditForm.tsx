import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { FormSelect } from "@fireback/ui-core/components/forms/form-select/FormSelect";
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { useS } from "@fireback/ui-core/hooks/useS";
import { TreasuryDto } from "./sdk/TreasuryDto";
import { useWalletsQuerySource } from "./AdminCreateWalletQuerySources";
import { strings } from "./strings/translations";

function walletLabel(w: any): string {
  if (!w) return "";
  const owner = w.userId || w.workspaceId || "";
  return `${w.currency} - ${owner} (${w.uniqueId})`;
}

// name/description are complexes.TString (locale -> text map) - FormTString edits every
// configured language at once, same as WorkspaceTypeEditForm's own title field. wallet
// is select-only (see TreasuryImplementation.go's resolveTreasuryWallet - a treasury
// never creates a wallet inline, only links to one that already exists), locked once
// set on edit - see TreasuryEntityManager's own doc comment on why.
export const TreasuryEditForm = ({
  form,
  isEditing,
}: EntityFormProps<Partial<TreasuryDto>>) => {
  const { values, setFieldValue, errors } = form;
  const s = useS(strings);

  return (
    <>
      <FormTString
        value={values.name}
        onChange={(value) => setFieldValue(TreasuryDto.Fields.name, value, false)}
        errorMessage={errors.name as any}
        label={s.treasuries.name}
      />
      <FormTString
        value={values.description}
        onChange={(value) =>
          setFieldValue(TreasuryDto.Fields.description, value, false)
        }
        errorMessage={errors.description as any}
        label={s.treasuries.description}
      />
      <FormSelect
        querySource={useWalletsQuerySource}
        keyExtractor={(item: any) => item?.uniqueId}
        fnLabelFormat={(item: any) => walletLabel(item)}
        value={(values as any).wallet}
        onChange={(item: any) => setFieldValue("wallet", item || undefined, false)}
        disabled={isEditing}
        errorMessage={errors.wallet as any}
        label={s.treasuries.walletId}
        hint={
          isEditing
            ? s.treasuries.walletLockedHint
            : s.treasuries.selectWalletHint
        }
        placeholder={s.treasuries.selectWallet}
      />
    </>
  );
};
