import { Formik, type FormikProps } from "formik";
import { AdminCreateWalletForm } from "./AdminCreateWalletForm";
import {
  useAdminCreateWalletAction,
  AdminCreateWalletActionReq,
} from "./sdk/AdminCreateWalletAction";
import { useCommonEntityManager } from "@fireback/ui-core/hooks/useCommonEntityManager";
import { httpErrorHanlder, mutationErrorsToFormik } from "@fireback/ui-core/hooks/api";
import { Save } from "lucide-react";
import { useS } from "@fireback/ui-core/hooks/useS";
import { strings } from "./strings/translations";
// httpErrorHanlder's `s` param is typed against ui-core's own shared strings, not this
// module's - same pattern as CategoryEntityManager.tsx.
import { strings as coreStrings } from "@fireback/ui-core/components/strings/translations";
import { WalletNavigation } from "./WalletNavigation";

// Create-only screen: wallet has no update/get action a client can reach (balance and
// everything else changes only through purchase/adjustBalance/topup - see
// Wallet.emi.yml's features override on the wallet entity), so unlike
// CategoryEntityManager this never edits an existing row.
export const AdminCreateWalletEntityManager = () => {
  const { formik, router } = useCommonEntityManager<
    Partial<AdminCreateWalletActionReq>
  >({});
  const s = useS(strings);
  const sCore = useS(coreStrings);

  const { mutateAsync: createWallet, isPending: isCreating } =
    useAdminCreateWalletAction();

  // Same bug this fixes elsewhere (CategoryEntityManager.tsx): the fetch layer
  // resolves the mutation promise even on a backend validation error, so the real
  // success/failure signal is response.data.item, not promise rejection.
  const handleSaveResponse = (response: any) => {
    if (response?.data?.item) {
      router.push(WalletNavigation.query());
      return;
    }
    const errorInfo = response?.error?.toJSON?.() ?? response?.error;
    formik.current?.setErrors(mutationErrorsToFormik({ error: errorInfo }));
    httpErrorHanlder(response, sCore);
  };

  return (
    <Formik
      innerRef={(r) => {
        formik.current = r;
      }}
      initialValues={{}}
      onSubmit={(form) => {
        const dto = AdminCreateWalletActionReq.with(form);
        createWallet(dto).then(handleSaveResponse);
      }}
    >
      {(form: FormikProps<Partial<AdminCreateWalletActionReq>>) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.submitForm();
          }}
        >
          <h1>{s.wallets.newWallet}</h1>
          <fieldset disabled={isCreating} style={{ marginTop: 20 }}>
            <AdminCreateWalletForm form={form as any} isEditing={false} />
            <div className="d-flex justify-content-end mt-3">
              <button
                id="submit-form"
                type="submit"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                disabled={isCreating}
              >
                {isCreating ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </Formik>
  );
};
