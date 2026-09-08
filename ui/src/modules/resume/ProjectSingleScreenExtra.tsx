// Read-only "Experience"/"Descriptions" sections for the project single/view
// screen (ProjectRoutes.tsx's own singleScreenExtra) - these two are relation/
// array fields VirtualEntityManagerProps.fields' plain {key,label,format}
// shape (see SingleScreen.tsx/schemaCasting.ts's formatFieldValue) has no
// way to render meaningfully: `format` only special-cases "tstring", so
// anything else just falls through to formatCellValue's own generic
// object/array fallback - a raw JSON dump (or, before MOne.toJSON()'s own
// fix - see js-remote-ctx/common/operators.ts - literally "{}"). Excluded
// from ProjectRoutes.tsx's own explicit `fields` list entirely and rendered
// here instead as their own clearly-labeled sections, the same officially-
// supported escape hatch ResumeRoutes.tsx's own "Download PDF" button uses.
//
// `entity` is a ProjectDto instance (useProjectGetActionQuery's default
// creatorFn) - GET already returns experience/descriptions fully populated
// (ResumeActions.go's projectPreloadedDb/projectDtoFromEntity - see their
// own doc comments), so everything needed to render this is already on
// `entity`, no extra query needed.
import { useLocale } from "@fireback/ui-core/hooks/useLocale";
import { getTStringValue } from "@fireback/ui-core/types/TString";
import { type ProjectDto } from "@/modules/resume/sdk/ProjectDto";

// experience/descriptions/skills/target are all MOne/MArray/MCollection-
// wrapped (see @fireback/js-remote-ctx/common/operators.ts) - `.get()`
// unwraps to the plain value/array, tolerating an already-unwrapped plain
// value too (defensive - nothing here actually hands one, but cheap to
// allow) since a bare object has no `.get` to call.
function unwrap<T>(value: unknown): T | undefined {
  if (value && typeof (value as any).get === "function") {
    return (value as any).get();
  }
  return value as T | undefined;
}

export function ProjectSingleScreenExtra({ entity }: { entity?: Partial<ProjectDto> }) {
  const { locale } = useLocale();
  if (!entity) return null;

  const experience = unwrap<any>(entity.experience);
  const descriptions = unwrap<any[]>(entity.descriptions) ?? [];

  if (!experience && descriptions.length === 0) {
    return null;
  }

  return (
    <div className="project-single-extra mt-3">
      {experience && (
        <div className="mb-3">
          <h6>Experience</h6>
          <div className="card">
            <div className="card-body">
              <div className="fw-bold">
                {getTStringValue(experience.jobTitle, locale)}
                {experience.company ? ` @ ${getTStringValue(experience.company, locale)}` : ""}
              </div>
              <div className="text-muted small">
                {[experience.startDate, experience.endDate].filter(Boolean).join(" — ")}
              </div>
              {Array.isArray(experience.achievements) && experience.achievements.length > 0 && (
                <ul className="mt-2 mb-0">
                  {experience.achievements.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {descriptions.length > 0 && (
        <div>
          <h6>Descriptions</h6>
          {descriptions.map((item, index) => {
            const target = unwrap<any>(item.target);
            const skills = unwrap<any[]>(item.skills) ?? [];
            return (
              <div className="card mb-2" key={item.uniqueId ?? index}>
                <div className="card-body">
                  <div className="fw-bold">
                    {target ? getTStringValue(target.name, locale) : `Description #${index + 1}`}
                  </div>
                  <div>{getTStringValue(item.content, locale)}</div>
                  {skills.length > 0 && (
                    <div className="mt-2">
                      {skills.map((s: any) => (
                        <span className="badge bg-secondary me-1" key={s.uniqueId}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProjectSingleScreenExtra;
