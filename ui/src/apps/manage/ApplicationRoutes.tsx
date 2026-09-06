import { FirebackEssentialRouterManager } from "@fireback/enterprise-shell/EssentialRouter";
import { useResumeRoutes } from "../../modules/resume/ResumeRoutes";
import { useCompanyRoutes } from "../../modules/resume/CompanyRoutes";
import { useTargetPositionRoutes } from "../../modules/resume/TargetPositionRoutes";
import { useWorkExperienceRoutes } from "../../modules/resume/WorkExperienceRoutes";
import { useEducationRoutes } from "../../modules/resume/EducationRoutes";
import { useSkillRoutes } from "../../modules/resume/SkillRoutes";
import { useProjectRoutes } from "../../modules/resume/ProjectRoutes";
import { useCertificationRoutes } from "../../modules/resume/CertificationRoutes";
import { useLanguageRoutes } from "../../modules/resume/LanguageRoutes";

export function ApplicationRoutes({ routerId }: { routerId?: string }) {
  const resumeRoutes = useResumeRoutes();
  const companyRoutes = useCompanyRoutes();
  const targetPositionRoutes = useTargetPositionRoutes();
  const workExperienceRoutes = useWorkExperienceRoutes();
  const educationRoutes = useEducationRoutes();
  const skillRoutes = useSkillRoutes();
  const projectRoutes = useProjectRoutes();
  const certificationRoutes = useCertificationRoutes();
  const languageRoutes = useLanguageRoutes();

  return (
    <FirebackEssentialRouterManager routerId={routerId}>
      {/* ~ auto:useRouteJsx */}
      {resumeRoutes}
      {companyRoutes}
      {targetPositionRoutes}
      {workExperienceRoutes}
      {educationRoutes}
      {skillRoutes}
      {projectRoutes}
      {certificationRoutes}
      {languageRoutes}
    </FirebackEssentialRouterManager>
  );
}
