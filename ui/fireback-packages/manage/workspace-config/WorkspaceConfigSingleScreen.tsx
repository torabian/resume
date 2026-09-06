import { CommonSingleManager } from "@fireback/ui-core/components/entity-manager/CommonSingleManager";
import { GeneralEntityView } from "@fireback/ui-core/components/general-entity-view/GeneralEntityView";
import { useS } from "@fireback/ui-core/hooks/useS";
import { useWorkspaceConfigDistinctGetActionQuery } from "@fireback/manage/sdk/abac/WorkspaceConfigDistinctGetAction";
import { WorkspaceConfigNavigation } from "@fireback/ui-core/sdk/navigation/AbacNavigation";
import { strings } from "./strings/translations";

export const WorkspaceConfigSingleScreen = () => {
  const getSingleHook = useWorkspaceConfigDistinctGetActionQuery({});
  var d = getSingleHook.data?.data?.item;

  const t = useS(strings);

  return (
    <>
      <CommonSingleManager
        editEntityHandler={({ locale, router }) => {
          router.push(WorkspaceConfigNavigation.edit(""));
        }}
        noBack
        disableOnGetFailed
        getSingleHook={getSingleHook}
      >
        <GeneralEntityView
          title={t.workspaceConfigs.title}
          description={t.workspaceConfigs.description}
          entity={d}
          fields={[
            {
              elem: d?.recaptcha2ServerKey,
              label: t.workspaceConfigs.recaptcha2ServerKey,
            },
            {
              elem: d?.recaptcha2ClientKey,
              label: t.workspaceConfigs.recaptcha2ClientKey,
            },
            {
              elem: d?.enableOtp,
              label: t.workspaceConfigs.enableOtp,
            },
            {
              elem: d?.enableRecaptcha2,
              label: t.workspaceConfigs.enableRecaptcha2,
            },
            {
              elem: d?.requireOtpOnSignin,
              label: t.workspaceConfigs.requireOtpOnSignin,
            },
            {
              elem: d?.requireOtpOnSignup,
              label: t.workspaceConfigs.requireOtpOnSignup,
            },
            {
              elem: d?.enableTotp,
              label: t.workspaceConfigs.enableTotp,
            },
            {
              elem: d?.forceTotp,
              label: t.workspaceConfigs.forceTotp,
            },
            {
              elem: d?.forcePasswordOnPhone,
              label: t.workspaceConfigs.forcePasswordOnPhone,
            },
            {
              elem: d?.forcePersonNameOnPhone,
              label: t.workspaceConfigs.forcePersonNameOnPhone,
            },
          ]}
        />
      </CommonSingleManager>
    </>
  );
};
