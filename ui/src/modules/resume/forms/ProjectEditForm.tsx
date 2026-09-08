// Fully hand-written create/edit form for the "project" entity - passed as
// VirtualEntityManager's `customForm` (see ProjectRoutes.tsx and
// @fireback/virtual-entity-manager's types.ts doc comment on that prop),
// bypassing the schema-driven rjsf form ProjectRoutes.tsx's PROJECT_SCHEMA
// would otherwise render. Reached for here (rather than staying on the
// generic form, the way every other resume entity still does) because
// `descriptions` - one write-up of the project per target position, each
// with its own target-position pick, TString content and a skills list -
// needs a real per-item sub-form (a tab, in this case) that a plain JSON
// Schema array can't express, the same reasoning ProjectDescriptionsTabs.tsx
// documents on its own. Every other field here is a plain, un-nested value,
// so it's just FormText/FormTString/FormDate/FormSelect - same widgets
// ProjectRoutes.tsx's rjsf-driven uiSchema (role/summary/experience) already
// used, just wired by hand instead of through rjsf.
//
// Follows the same "entity manager pattern" as
// fireback-packages/manage/users/UserEditForm.tsx: a plain component typed
// against EntityFormProps<T>, reading/writing through `form.values`/
// `form.setFieldValue` - CommonEntityManager's own wrapped setFieldValue
// (see its doc comment) mirrors every write into the actual submit payload,
// so there's nothing else this file needs to do to make an edit persist.
import { type EntityFormProps } from "@fireback/ui-core/types/EntityManagement";
import { FormText } from "@fireback/ui-core/components/forms/form-text/FormText";
import { FormTString } from "@fireback/ui-core/components/forms/form-tstring/FormTString";
import { FormDate } from "@fireback/ui-core/components/forms/form-date/FormDate";
import { FormOne } from "@fireback/ui-core/components/forms/form-one/FormOne";
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type ProjectDto } from "@/modules/resume/sdk/ProjectDto";
import { type WorkExperienceDto } from "@/modules/resume/sdk/WorkExperienceDto";
import { useWorkExperiencesQuerySource } from "../WorkExperienceQuerySource";
import {
  ProjectDescriptionsTabs,
  type ProjectDescriptionItem,
} from "./ProjectDescriptionsTabs";
import "./ProjectEditForm.css";

export function ProjectEditForm({
  form,
}: EntityFormProps<Partial<ProjectDto>>) {
  const { values, setFieldValue, errors } = form;
  const { locale } = useLocale();

  return (
    <div className="row">
      <div className="col-md-12">
        <FormText
          label="Name"
          value={values?.name}
          errorMessage={(errors as any)?.name}
          onChange={(v) => setFieldValue("name", v, false)}
        />
      </div>
      <div className="col-md-12">
        <FormTString
          label="Role"
          value={values?.role as any}
          errorMessage={(errors as any)?.role}
          onChange={(v) => setFieldValue("role", v, false)}
        />
      </div>
      <div className="col-md-12">
        <FormTString
          label="Summary"
          multiline
          value={values?.summary as any}
          errorMessage={(errors as any)?.summary}
          onChange={(v) => setFieldValue("summary", v, false)}
        />
      </div>
      <div className="col-md-6">
        <FormDate
          label="Start date"
          value={values?.startDate as any}
          errorMessage={(errors as any)?.startDate}
          onChange={(v) => setFieldValue("startDate", v, false)}
        />
      </div>
      <div className="col-md-6">
        <FormDate
          label="End date"
          value={values?.endDate as any}
          errorMessage={(errors as any)?.endDate}
          onChange={(v) => setFieldValue("endDate", v, false)}
        />
      </div>
      <div className="col-md-6">
        <FormText
          label="URL"
          value={values?.url}
          errorMessage={(errors as any)?.url}
          onChange={(v) => setFieldValue("url", v, false)}
        />
      </div>
      <div className="col-md-6">
        <FormText
          label="Repo URL"
          value={values?.repoUrl}
          errorMessage={(errors as any)?.repoUrl}
          onChange={(v) => setFieldValue("repoUrl", v, false)}
        />
      </div>
      <div className="col-md-12">
        <FormOne<WorkExperienceDto, string>
          label="Experience"
          hint="The work experience that this project is done based on that."
          value={values?.experience as any}
          querySource={useWorkExperiencesQuerySource}
          keyExtractor={(e) => e.uniqueId as string}
          fnLabelFormat={(e) => workExperienceLabel(e, locale)}
          errorMessage={(errors as any)?.experience}
          onChange={(value) => setFieldValue("experience", value, false)}
        />
      </div>
      <div className="col-md-12">
        <label className="form-label">Descriptions</label>
        <ProjectDescriptionsTabs
          value={values?.descriptions as ProjectDescriptionItem[] | undefined}
          errors={(errors as any)?.descriptions}
          onChange={(next) => setFieldValue("descriptions", next, false)}
        />
      </div>
    </div>
  );
}

function workExperienceLabel(e: WorkExperienceDto, locale: string): string {
  const jobTitle = getTStringValue(e.jobTitle as any, locale);
  const company = getTStringValue(e.company as any, locale);
  return (
    [jobTitle, company].filter(Boolean).join(" @ ") || (e.uniqueId as string)
  );
}
