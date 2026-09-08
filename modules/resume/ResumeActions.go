package resume

// ResumeActions.go implements every action Resume.emi.yml's entities
// generated (Create/Update/Get/Browse/AwareDeletePreview/AwareDelete for
// Resume, Company, TargetPosition, WorkExperience, Education, Skill,
// Project, Certification and Language) - the pieces ResumeModule.go's own
// doc comment said weren't wired up yet.
//
// Every action leans on the generated defs/*.go as much as possible:
//   - Create/Update delegate straight to resumedefs.{Entity}EntityActions.Create/
//     Update - Update already merges every Nullable field itself (see
//     WorkExperienceEntityUpdateFn), so there's nothing left for this file
//     to do beyond the not-found check.
//   - Get/Browse/AwareDeletePreview/AwareDelete call the matching
//     resumedefs.{Entity}EntityActions.* function directly.
//
// None of Resume.emi.yml's entities carry a `one`/`one?` relation field
// today (see its own doc comment: every section used to link back to its
// owning Resume via `resume: one target: ResumeEntity`, but that's been
// removed from all of them - they're independent, unscoped rows now), so
// there's no relation-selector resolution left to do here either -
// resumeSelectorId/resolveResumeId and their WorkExperience-only
// companySelectorId/resolveCompanyId equivalents (both used the same
// emigorm.ReconcileOne approach as
// ../nima/modules/score/CreateScoreImplementation.go's own
// scoreMusicalWorkSelectorId + ReconcileOne("select", ...) call) were
// removed along with the fields they resolved.
//
// None of this wires workspace/user scoping or permissions (see
// ResumeModule.go's doc comment for why) - fireback.GetDbRef() is used
// unscoped throughout.
import (
	"errors"
	"net/http"

	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"gorm.io/gorm"
)

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// gResponseQuery builds the fireback.GoogleResponse[T] paged-list envelope
// directly from the emigo.QueryResultMeta our generated {Entity}EntityActions.Browse
// returns - same shape as ../nima/modules/score/ActionErrors.go's own
// gResponseQuery, adjusted for emigo.QueryResultMeta (TotalItems/Cursor only,
// no TotalAvailableItems) instead of fireback.QueryResultMeta.
func gResponseQuery[T any](items []T, meta *emigo.QueryResultMeta, startIndex, itemsPerPage int) fireback.GoogleResponse[T] {
	res := fireback.GoogleResponse[T]{Data: fireback.GoogleResponseData[T]{Items: items}}
	if meta != nil {
		if meta.Cursor != nil {
			res.Data.Cursor = *meta.Cursor
		}
		res.Data.TotalItems = meta.TotalItems
		res.Data.StartIndex = int64(startIndex)
		res.Data.ItemsPerPage = int64(itemsPerPage)
	}
	return res
}

// ---------------------------------------------------------------------------
// Entity <-> Dto mapping
// ---------------------------------------------------------------------------

func resumeDtoFromEntity(e *resumedefs.ResumeEntity) resumedefs.ResumeDto {
	return resumedefs.ResumeDto{
		UniqueId:  emigo.NullableOf(e.UniqueId),
		FullName:  e.FullName,
		Headline:  e.Headline,
		Summary:   e.Summary,
		Email:     e.Email,
		Phone:     e.Phone,
		Location:  e.Location,
		Website:   e.Website,
		Linkedin:  e.Linkedin,
		Github:    e.Github,
		PhotoUrl:  e.PhotoUrl,
		Language:  e.Language,
		IsPrimary: e.IsPrimary,
		Content:   e.Content,
	}
}

func companyDtoFromEntity(e *resumedefs.CompanyEntity) resumedefs.CompanyDto {
	return resumedefs.CompanyDto{
		UniqueId:    emigo.NullableOf(e.UniqueId),
		Name:        e.Name,
		Industry:    e.Industry,
		Website:     e.Website,
		LogoUrl:     e.LogoUrl,
		Location:    e.Location,
		Description: e.Description,
	}
}

// targetPositionDtoFromEntity is Company's standalone-entity shape reused
// as-is: TargetPosition has no relations either (see
// Resume.emi.yml's own doc comment on it - a reference point a resume's
// content is written towards, not itself owned by one).
func targetPositionDtoFromEntity(e *resumedefs.TargetPositionEntity) resumedefs.TargetPositionDto {
	return resumedefs.TargetPositionDto{
		UniqueId: emigo.NullableOf(e.UniqueId),
		Name:     e.Name,
	}
}

// workExperienceDtoFromEntity is a plain field-for-field copy - WorkExperience
// no longer carries a resume/company relation (see Resume.emi.yml: `company`
// is now a plain `complex: TString` field, and the `resume: one` link that
// used to scope Browse by resumeId is gone), so unlike
// resumeDtoFromEntity/companyDtoFromEntity's siblings there's no OneNullable
// relation left to populate here.
func workExperienceDtoFromEntity(e *resumedefs.WorkExperienceEntity) resumedefs.WorkExperienceDto {
	return resumedefs.WorkExperienceDto{
		UniqueId:       emigo.NullableOf(e.UniqueId),
		Company:        e.Company,
		JobTitle:       e.JobTitle,
		EmploymentType: e.EmploymentType,
		Location:       e.Location,
		StartDate:      e.StartDate,
		EndDate:        e.EndDate,
		Achievements:   e.Achievements,
	}
}

func educationDtoFromEntity(e *resumedefs.EducationEntity) resumedefs.EducationDto {
	dto := resumedefs.EducationDto{
		UniqueId:     emigo.NullableOf(e.UniqueId),
		Institution:  e.Institution,
		Degree:       e.Degree,
		FieldOfStudy: e.FieldOfStudy,
		Location:     e.Location,
		StartDate:    e.StartDate,
		EndDate:      e.EndDate,
		IsCurrent:    e.IsCurrent,
		Grade:        e.Grade,
		Description:  e.Description,
	}
	return dto
}

func skillDtoFromEntity(e *resumedefs.SkillEntity) resumedefs.SkillDto {
	dto := resumedefs.SkillDto{
		UniqueId:          emigo.NullableOf(e.UniqueId),
		Name:              e.Name,
		Category:          e.Category,
		Level:             e.Level,
		YearsOfExperience: e.YearsOfExperience,
		Description:       e.Description,
	}
	return dto
}

// projectDtoFromEntity populates Experience/Descriptions from e's *preloaded*
// relations - ProjectGetAction/ProjectUpdateAction/ProjectBrowseAction below
// all chain .Preload("Experience")/.Preload("Descriptions.Target")/
// .Preload("Descriptions.SkillsRow") onto the tx they pass in before calling
// the generated resumedefs.ProjectEntityActions.*, specifically so
// e.Experience/e.Descriptions/e.Descriptions[i].Target/SkillsRow are never
// left at their zero value here. Without that preload, e.ExperienceId (and
// each description's TargetId) is still a real, correctly-persisted FK - the
// column write always worked - but e.Experience itself silently stays a
// zero-valued WorkExperienceEntity, so it round-tripped back through the API
// as "experience": null even right after a successful select.
func projectDtoFromEntity(e *resumedefs.ProjectEntity) resumedefs.ProjectDto {
	dto := resumedefs.ProjectDto{
		UniqueId:  emigo.NullableOf(e.UniqueId),
		Name:      e.Name,
		Role:      e.Role,
		Summary:   e.Summary,
		StartDate: e.StartDate,
		EndDate:   e.EndDate,
		Url:       e.Url,
		RepoUrl:   e.RepoUrl,
	}

	if e.ExperienceId != 0 {
		dto.Experience = emigo.NewOneNullable(workExperienceDtoFromEntity(&e.Experience))
	}

	descriptions := make([]resumedefs.ProjectDtoDescriptions, len(e.Descriptions))
	for i, d := range e.Descriptions {
		item := resumedefs.ProjectDtoDescriptions{
			Content: d.Content,
		}
		if d.Target != nil {
			item.Target = emigo.NewOneNullable(targetPositionDtoFromEntity(d.Target))
		}
		if len(d.SkillsRow) > 0 {
			skills := make([]resumedefs.SkillDto, len(d.SkillsRow))
			for j, s := range d.SkillsRow {
				skills[j] = skillDtoFromEntity(s)
			}
			item.Skills = emigo.CollectionNullableReplace(skills)
		}
		descriptions[i] = item
	}
	dto.Descriptions = emigo.ArrayReplace(descriptions)

	return dto
}

func certificationDtoFromEntity(e *resumedefs.CertificationEntity) resumedefs.CertificationDto {
	dto := resumedefs.CertificationDto{
		UniqueId:            emigo.NullableOf(e.UniqueId),
		Name:                e.Name,
		IssuingOrganization: e.IssuingOrganization,
		IssueDate:           e.IssueDate,
		ExpirationDate:      e.ExpirationDate,
		CredentialId:        e.CredentialId,
		CredentialUrl:       e.CredentialUrl,
	}
	return dto
}

func languageDtoFromEntity(e *resumedefs.LanguageEntity) resumedefs.LanguageDto {
	dto := resumedefs.LanguageDto{
		UniqueId:    emigo.NullableOf(e.UniqueId),
		Name:        e.Name,
		Proficiency: e.Proficiency,
	}
	return dto
}

// ===========================================================================
// Resume
// ===========================================================================

func ResumeCreateAction(c resumedefs.ResumeCreateActionRequest) (*resumedefs.ResumeCreateActionResponse, error) {
	created, err := resumedefs.ResumeEntityActions.Create(fireback.GetDbRef(), &resumedefs.ResumeEntity{
		FullName:  c.Body.FullName,
		Headline:  c.Body.Headline,
		Summary:   c.Body.Summary,
		Email:     c.Body.Email,
		Phone:     c.Body.Phone,
		Location:  c.Body.Location,
		Website:   c.Body.Website,
		Linkedin:  c.Body.Linkedin,
		Github:    c.Body.Github,
		PhotoUrl:  c.Body.PhotoUrl,
		Language:  c.Body.Language,
		IsPrimary: c.Body.IsPrimary,
		Content:   c.Body.Content,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.ResumeCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(resumeDtoFromEntity(created)),
	}, nil
}

func ResumeUpdateAction(c resumedefs.ResumeUpdateActionRequest) (*resumedefs.ResumeUpdateActionResponse, error) {
	updated, err := resumedefs.ResumeEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.ResumeUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "resume not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.ResumeUpdateActionResponse{Payload: fireback.GResponseSingleItem(resumeDtoFromEntity(updated))}, nil
}

func ResumeGetAction(c resumedefs.ResumeGetActionRequest) (*resumedefs.ResumeGetActionResponse, error) {
	entity, err := resumedefs.ResumeEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.ResumeGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "resume not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.ResumeGetActionResponse{Payload: fireback.GResponseSingleItem(resumeDtoFromEntity(entity))}, nil
}

func ResumeBrowseAction(c resumedefs.ResumeBrowseActionRequest) (*resumedefs.ResumeBrowseActionResponse, error) {
	qs := resumedefs.ResumeBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.ResumeEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.ResumeDto, len(items))
	for i, item := range items {
		dtos[i] = resumeDtoFromEntity(item)
	}
	return &resumedefs.ResumeBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func ResumeAwareDeletePreviewAction(c resumedefs.ResumeAwareDeletePreviewActionRequest) (*resumedefs.ResumeAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.ResumeAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.ResumeEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.ResumeAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.ResumeAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.ResumeAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.ResumeAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func ResumeAwareDeleteAction(c resumedefs.ResumeAwareDeleteActionRequest) (*resumedefs.ResumeAwareDeleteActionResponse, error) {
	if err := resumedefs.ResumeEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.ResumeAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Company
// ===========================================================================

func CompanyCreateAction(c resumedefs.CompanyCreateActionRequest) (*resumedefs.CompanyCreateActionResponse, error) {
	created, err := resumedefs.CompanyEntityActions.Create(fireback.GetDbRef(), &resumedefs.CompanyEntity{
		Name:        c.Body.Name,
		Industry:    c.Body.Industry,
		Website:     c.Body.Website,
		LogoUrl:     c.Body.LogoUrl,
		Location:    c.Body.Location,
		Description: c.Body.Description,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.CompanyCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(companyDtoFromEntity(created)),
	}, nil
}

func CompanyUpdateAction(c resumedefs.CompanyUpdateActionRequest) (*resumedefs.CompanyUpdateActionResponse, error) {
	updated, err := resumedefs.CompanyEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.CompanyUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "company not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.CompanyUpdateActionResponse{Payload: fireback.GResponseSingleItem(companyDtoFromEntity(updated))}, nil
}

func CompanyGetAction(c resumedefs.CompanyGetActionRequest) (*resumedefs.CompanyGetActionResponse, error) {
	entity, err := resumedefs.CompanyEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.CompanyGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "company not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.CompanyGetActionResponse{Payload: fireback.GResponseSingleItem(companyDtoFromEntity(entity))}, nil
}

func CompanyBrowseAction(c resumedefs.CompanyBrowseActionRequest) (*resumedefs.CompanyBrowseActionResponse, error) {
	qs := resumedefs.CompanyBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.CompanyEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.CompanyDto, len(items))
	for i, item := range items {
		dtos[i] = companyDtoFromEntity(item)
	}
	return &resumedefs.CompanyBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func CompanyAwareDeletePreviewAction(c resumedefs.CompanyAwareDeletePreviewActionRequest) (*resumedefs.CompanyAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.CompanyAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.CompanyEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.CompanyAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.CompanyAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.CompanyAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.CompanyAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func CompanyAwareDeleteAction(c resumedefs.CompanyAwareDeleteActionRequest) (*resumedefs.CompanyAwareDeleteActionResponse, error) {
	if err := resumedefs.CompanyEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.CompanyAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// TargetPosition
// ===========================================================================

func TargetPositionCreateAction(c resumedefs.TargetPositionCreateActionRequest) (*resumedefs.TargetPositionCreateActionResponse, error) {
	created, err := resumedefs.TargetPositionEntityActions.Create(fireback.GetDbRef(), &resumedefs.TargetPositionEntity{
		Name: c.Body.Name,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.TargetPositionCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(targetPositionDtoFromEntity(created)),
	}, nil
}

func TargetPositionUpdateAction(c resumedefs.TargetPositionUpdateActionRequest) (*resumedefs.TargetPositionUpdateActionResponse, error) {
	updated, err := resumedefs.TargetPositionEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.TargetPositionUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "target position not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.TargetPositionUpdateActionResponse{Payload: fireback.GResponseSingleItem(targetPositionDtoFromEntity(updated))}, nil
}

func TargetPositionGetAction(c resumedefs.TargetPositionGetActionRequest) (*resumedefs.TargetPositionGetActionResponse, error) {
	entity, err := resumedefs.TargetPositionEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.TargetPositionGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "target position not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.TargetPositionGetActionResponse{Payload: fireback.GResponseSingleItem(targetPositionDtoFromEntity(entity))}, nil
}

func TargetPositionBrowseAction(c resumedefs.TargetPositionBrowseActionRequest) (*resumedefs.TargetPositionBrowseActionResponse, error) {
	qs := resumedefs.TargetPositionBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.TargetPositionEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.TargetPositionDto, len(items))
	for i, item := range items {
		dtos[i] = targetPositionDtoFromEntity(item)
	}
	return &resumedefs.TargetPositionBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func TargetPositionAwareDeletePreviewAction(c resumedefs.TargetPositionAwareDeletePreviewActionRequest) (*resumedefs.TargetPositionAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.TargetPositionAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.TargetPositionEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.TargetPositionAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.TargetPositionAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.TargetPositionAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.TargetPositionAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func TargetPositionAwareDeleteAction(c resumedefs.TargetPositionAwareDeleteActionRequest) (*resumedefs.TargetPositionAwareDeleteActionResponse, error) {
	if err := resumedefs.TargetPositionEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.TargetPositionAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// WorkExperience
// ===========================================================================

func WorkExperienceCreateAction(c resumedefs.WorkExperienceCreateActionRequest) (*resumedefs.WorkExperienceCreateActionResponse, error) {
	created, err := resumedefs.WorkExperienceEntityActions.Create(fireback.GetDbRef(), &resumedefs.WorkExperienceEntity{
		Company:        c.Body.Company,
		JobTitle:       c.Body.JobTitle,
		EmploymentType: c.Body.EmploymentType,
		Location:       c.Body.Location,
		StartDate:      c.Body.StartDate,
		EndDate:        c.Body.EndDate,
		Achievements:   c.Body.Achievements,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.WorkExperienceCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(workExperienceDtoFromEntity(created)),
	}, nil
}

func WorkExperienceUpdateAction(c resumedefs.WorkExperienceUpdateActionRequest) (*resumedefs.WorkExperienceUpdateActionResponse, error) {
	updated, err := resumedefs.WorkExperienceEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.WorkExperienceUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "work experience not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.WorkExperienceUpdateActionResponse{Payload: fireback.GResponseSingleItem(workExperienceDtoFromEntity(updated))}, nil
}

func WorkExperienceGetAction(c resumedefs.WorkExperienceGetActionRequest) (*resumedefs.WorkExperienceGetActionResponse, error) {
	entity, err := resumedefs.WorkExperienceEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.WorkExperienceGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "work experience not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.WorkExperienceGetActionResponse{Payload: fireback.GResponseSingleItem(workExperienceDtoFromEntity(entity))}, nil
}

func WorkExperienceBrowseAction(c resumedefs.WorkExperienceBrowseActionRequest) (*resumedefs.WorkExperienceBrowseActionResponse, error) {
	qs := resumedefs.WorkExperienceBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.WorkExperienceEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.WorkExperienceDto, len(items))
	for i, item := range items {
		dtos[i] = workExperienceDtoFromEntity(item)
	}
	return &resumedefs.WorkExperienceBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func WorkExperienceAwareDeletePreviewAction(c resumedefs.WorkExperienceAwareDeletePreviewActionRequest) (*resumedefs.WorkExperienceAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.WorkExperienceAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.WorkExperienceEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.WorkExperienceAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.WorkExperienceAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.WorkExperienceAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.WorkExperienceAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func WorkExperienceAwareDeleteAction(c resumedefs.WorkExperienceAwareDeleteActionRequest) (*resumedefs.WorkExperienceAwareDeleteActionResponse, error) {
	if err := resumedefs.WorkExperienceEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.WorkExperienceAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Education
// ===========================================================================

func EducationCreateAction(c resumedefs.EducationCreateActionRequest) (*resumedefs.EducationCreateActionResponse, error) {
	tx := fireback.GetDbRef()

	created, err := resumedefs.EducationEntityActions.Create(tx, &resumedefs.EducationEntity{
		Institution:  c.Body.Institution,
		Degree:       c.Body.Degree,
		FieldOfStudy: c.Body.FieldOfStudy,
		Location:     c.Body.Location,
		StartDate:    c.Body.StartDate,
		EndDate:      c.Body.EndDate,
		IsCurrent:    c.Body.IsCurrent,
		Grade:        c.Body.Grade,
		Description:  c.Body.Description,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.EducationCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(educationDtoFromEntity(created)),
	}, nil
}

func EducationUpdateAction(c resumedefs.EducationUpdateActionRequest) (*resumedefs.EducationUpdateActionResponse, error) {
	updated, err := resumedefs.EducationEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.EducationUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "education not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.EducationUpdateActionResponse{Payload: fireback.GResponseSingleItem(educationDtoFromEntity(updated))}, nil
}

func EducationGetAction(c resumedefs.EducationGetActionRequest) (*resumedefs.EducationGetActionResponse, error) {
	entity, err := resumedefs.EducationEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.EducationGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "education not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.EducationGetActionResponse{Payload: fireback.GResponseSingleItem(educationDtoFromEntity(entity))}, nil
}

func EducationBrowseAction(c resumedefs.EducationBrowseActionRequest) (*resumedefs.EducationBrowseActionResponse, error) {
	qs := resumedefs.EducationBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.EducationEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.EducationDto, len(items))
	for i, item := range items {
		dtos[i] = educationDtoFromEntity(item)
	}
	return &resumedefs.EducationBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func EducationAwareDeletePreviewAction(c resumedefs.EducationAwareDeletePreviewActionRequest) (*resumedefs.EducationAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.EducationAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.EducationEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.EducationAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.EducationAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.EducationAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.EducationAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func EducationAwareDeleteAction(c resumedefs.EducationAwareDeleteActionRequest) (*resumedefs.EducationAwareDeleteActionResponse, error) {
	if err := resumedefs.EducationEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.EducationAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Skill
// ===========================================================================

func SkillCreateAction(c resumedefs.SkillCreateActionRequest) (*resumedefs.SkillCreateActionResponse, error) {
	tx := fireback.GetDbRef()

	created, err := resumedefs.SkillEntityActions.Create(tx, &resumedefs.SkillEntity{
		Name:              c.Body.Name,
		Category:          c.Body.Category,
		Level:             c.Body.Level,
		YearsOfExperience: c.Body.YearsOfExperience,
		Description:       c.Body.Description,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.SkillCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(skillDtoFromEntity(created)),
	}, nil
}

func SkillUpdateAction(c resumedefs.SkillUpdateActionRequest) (*resumedefs.SkillUpdateActionResponse, error) {
	updated, err := resumedefs.SkillEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.SkillUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "skill not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.SkillUpdateActionResponse{Payload: fireback.GResponseSingleItem(skillDtoFromEntity(updated))}, nil
}

func SkillGetAction(c resumedefs.SkillGetActionRequest) (*resumedefs.SkillGetActionResponse, error) {
	entity, err := resumedefs.SkillEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.SkillGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "skill not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.SkillGetActionResponse{Payload: fireback.GResponseSingleItem(skillDtoFromEntity(entity))}, nil
}

func SkillBrowseAction(c resumedefs.SkillBrowseActionRequest) (*resumedefs.SkillBrowseActionResponse, error) {
	qs := resumedefs.SkillBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.SkillEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.SkillDto, len(items))
	for i, item := range items {
		dtos[i] = skillDtoFromEntity(item)
	}
	return &resumedefs.SkillBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func SkillAwareDeletePreviewAction(c resumedefs.SkillAwareDeletePreviewActionRequest) (*resumedefs.SkillAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.SkillAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.SkillEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.SkillAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.SkillAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.SkillAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.SkillAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func SkillAwareDeleteAction(c resumedefs.SkillAwareDeleteActionRequest) (*resumedefs.SkillAwareDeleteActionResponse, error) {
	if err := resumedefs.SkillEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.SkillAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Project
// ===========================================================================

func ProjectCreateAction(c resumedefs.ProjectCreateActionRequest) (*resumedefs.ProjectCreateActionResponse, error) {
	tx := fireback.GetDbRef()

	// Experience/Descriptions (the relation fields that replaced isOngoing/
	// technologies/highlights below) aren't resolved here - unlike
	// ProjectEntityUpdateFn (defs/ProjectEntity.go), which does resolve
	// them via emigorm.ReconcileOne/ReconcileHasMany, Create goes straight
	// to tx.Create(dto) with no relation handling of its own. Wire that up
	// here (mirroring Update's approach) if project creation needs to set
	// an experience/descriptions from the start rather than via a
	// follow-up Update.
	created, err := resumedefs.ProjectEntityActions.Create(tx, &resumedefs.ProjectEntity{
		Name:      c.Body.Name,
		Role:      c.Body.Role,
		Summary:   c.Body.Summary,
		StartDate: c.Body.StartDate,
		EndDate:   c.Body.EndDate,
		Url:       c.Body.Url,
		RepoUrl:   c.Body.RepoUrl,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.ProjectCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(projectDtoFromEntity(created)),
	}, nil
}

// projectPreloadedDb chains every Preload projectDtoFromEntity's own doc
// comment relies on - Experience (a plain belongs-to) and, one level into
// each has-many Descriptions row, its own Target (belongs-to) and SkillsRow
// (many2many) - onto a fresh tx. gorm accumulates Preload calls on the
// *gorm.DB session itself, so passing this straight into
// resumedefs.ProjectEntityActions.Get/Browse (which just call plain
// tx.First()/tx.Find() with no preloads of their own) is enough to carry
// them through to the query those generated functions actually run.
//
// Deliberately NOT used for ProjectEntityActions.Update: Update's own
// tx.Transaction(...) internally runs further queries against *other*
// model types on that same session while resolving relations - e.g.
// emigorm.ReconcileOne[WorkExperienceEntity] for `experience`,
// emigorm.ReconcileOne[TargetPositionEntity] per description's `target` -
// and a gorm session's accumulated Preload paths apply indiscriminately to
// every query run through it, not just the one that actually has that
// relation. Passing this into Update surfaced as "Descriptions: unsupported
// relations for schema WorkExperienceEntity" the moment `experience` was
// set: WorkExperienceEntity has no `Descriptions` field for
// Preload("Descriptions.Target") to resolve against, so gorm's schema
// parser rejected the query outright, taking down the *whole* update mid-
// transaction, not just the relation being resolved. ProjectUpdateAction
// below instead re-fetches (with these preloads) via a separate Get call,
// after Update's own transaction has already committed and closed.
func projectPreloadedDb() *gorm.DB {
	return fireback.GetDbRef().
		Preload("Experience").
		Preload("Descriptions.Target").
		Preload("Descriptions.SkillsRow")
}

func ProjectUpdateAction(c resumedefs.ProjectUpdateActionRequest) (*resumedefs.ProjectUpdateActionResponse, error) {
	if _, err := resumedefs.ProjectEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.ProjectUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "project not found"}}, nil
		}
		return nil, err
	}
	// Re-fetched (rather than reusing Update's own return value) specifically
	// to pick up projectPreloadedDb's relations - see its own doc comment on
	// why they can't just be chained onto the Update call itself.
	updated, err := resumedefs.ProjectEntityActions.Get(projectPreloadedDb(), c.Params.UniqueId)
	if err != nil {
		return nil, err
	}
	return &resumedefs.ProjectUpdateActionResponse{Payload: fireback.GResponseSingleItem(projectDtoFromEntity(updated))}, nil
}

func ProjectGetAction(c resumedefs.ProjectGetActionRequest) (*resumedefs.ProjectGetActionResponse, error) {
	entity, err := resumedefs.ProjectEntityActions.Get(projectPreloadedDb(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.ProjectGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "project not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.ProjectGetActionResponse{Payload: fireback.GResponseSingleItem(projectDtoFromEntity(entity))}, nil
}

func ProjectBrowseAction(c resumedefs.ProjectBrowseActionRequest) (*resumedefs.ProjectBrowseActionResponse, error) {
	qs := resumedefs.ProjectBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.ProjectEntityActions.Browse(projectPreloadedDb(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.ProjectDto, len(items))
	for i, item := range items {
		dtos[i] = projectDtoFromEntity(item)
	}
	return &resumedefs.ProjectBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func ProjectAwareDeletePreviewAction(c resumedefs.ProjectAwareDeletePreviewActionRequest) (*resumedefs.ProjectAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.ProjectAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.ProjectEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.ProjectAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.ProjectAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.ProjectAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.ProjectAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func ProjectAwareDeleteAction(c resumedefs.ProjectAwareDeleteActionRequest) (*resumedefs.ProjectAwareDeleteActionResponse, error) {
	if err := resumedefs.ProjectEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.ProjectAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Certification
// ===========================================================================

func CertificationCreateAction(c resumedefs.CertificationCreateActionRequest) (*resumedefs.CertificationCreateActionResponse, error) {
	tx := fireback.GetDbRef()

	created, err := resumedefs.CertificationEntityActions.Create(tx, &resumedefs.CertificationEntity{
		Name:                c.Body.Name,
		IssuingOrganization: c.Body.IssuingOrganization,
		IssueDate:           c.Body.IssueDate,
		ExpirationDate:      c.Body.ExpirationDate,
		CredentialId:        c.Body.CredentialId,
		CredentialUrl:       c.Body.CredentialUrl,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.CertificationCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(certificationDtoFromEntity(created)),
	}, nil
}

func CertificationUpdateAction(c resumedefs.CertificationUpdateActionRequest) (*resumedefs.CertificationUpdateActionResponse, error) {
	updated, err := resumedefs.CertificationEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.CertificationUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "certification not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.CertificationUpdateActionResponse{Payload: fireback.GResponseSingleItem(certificationDtoFromEntity(updated))}, nil
}

func CertificationGetAction(c resumedefs.CertificationGetActionRequest) (*resumedefs.CertificationGetActionResponse, error) {
	entity, err := resumedefs.CertificationEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.CertificationGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "certification not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.CertificationGetActionResponse{Payload: fireback.GResponseSingleItem(certificationDtoFromEntity(entity))}, nil
}

func CertificationBrowseAction(c resumedefs.CertificationBrowseActionRequest) (*resumedefs.CertificationBrowseActionResponse, error) {
	qs := resumedefs.CertificationBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.CertificationEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.CertificationDto, len(items))
	for i, item := range items {
		dtos[i] = certificationDtoFromEntity(item)
	}
	return &resumedefs.CertificationBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func CertificationAwareDeletePreviewAction(c resumedefs.CertificationAwareDeletePreviewActionRequest) (*resumedefs.CertificationAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.CertificationAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.CertificationEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.CertificationAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.CertificationAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.CertificationAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.CertificationAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func CertificationAwareDeleteAction(c resumedefs.CertificationAwareDeleteActionRequest) (*resumedefs.CertificationAwareDeleteActionResponse, error) {
	if err := resumedefs.CertificationEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.CertificationAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}

// ===========================================================================
// Language
// ===========================================================================

func LanguageCreateAction(c resumedefs.LanguageCreateActionRequest) (*resumedefs.LanguageCreateActionResponse, error) {
	tx := fireback.GetDbRef()

	created, err := resumedefs.LanguageEntityActions.Create(tx, &resumedefs.LanguageEntity{
		Name:        c.Body.Name,
		Proficiency: c.Body.Proficiency,
	})
	if err != nil {
		return nil, err
	}
	return &resumedefs.LanguageCreateActionResponse{
		StatusCode: http.StatusCreated,
		Payload:    fireback.GResponseSingleItem(languageDtoFromEntity(created)),
	}, nil
}

func LanguageUpdateAction(c resumedefs.LanguageUpdateActionRequest) (*resumedefs.LanguageUpdateActionResponse, error) {
	updated, err := resumedefs.LanguageEntityActions.Update(fireback.GetDbRef(), c.Params.UniqueId, c.Body)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.LanguageUpdateActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "language not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.LanguageUpdateActionResponse{Payload: fireback.GResponseSingleItem(languageDtoFromEntity(updated))}, nil
}

func LanguageGetAction(c resumedefs.LanguageGetActionRequest) (*resumedefs.LanguageGetActionResponse, error) {
	entity, err := resumedefs.LanguageEntityActions.Get(fireback.GetDbRef(), c.Params.UniqueId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &resumedefs.LanguageGetActionResponse{StatusCode: http.StatusNotFound, Payload: map[string]string{"error": "language not found"}}, nil
		}
		return nil, err
	}
	return &resumedefs.LanguageGetActionResponse{Payload: fireback.GResponseSingleItem(languageDtoFromEntity(entity))}, nil
}

func LanguageBrowseAction(c resumedefs.LanguageBrowseActionRequest) (*resumedefs.LanguageBrowseActionResponse, error) {
	qs := resumedefs.LanguageBrowseActionQueryFromString(c.QueryParams.Encode())
	items, meta, err := resumedefs.LanguageEntityActions.Browse(fireback.GetDbRef(), qs, "")
	if err != nil {
		return nil, err
	}
	dtos := make([]resumedefs.LanguageDto, len(items))
	for i, item := range items {
		dtos[i] = languageDtoFromEntity(item)
	}
	return &resumedefs.LanguageBrowseActionResponse{
		Payload: gResponseQuery(dtos, meta, qs.StartIndex, qs.ItemsPerPage),
	}, nil
}

func LanguageAwareDeletePreviewAction(c resumedefs.LanguageAwareDeletePreviewActionRequest) (*resumedefs.LanguageAwareDeletePreviewActionResponse, error) {
	qs := resumedefs.LanguageAwareDeletePreviewActionQueryFromString(c.QueryParams.Encode())
	preview, err := resumedefs.LanguageEntityActions.AwareDeletePreview(fireback.GetDbRef(), qs.UniqueIds)
	if err != nil {
		return nil, err
	}
	affected := make([]resumedefs.LanguageAwareDeletePreviewActionResAffected, len(preview.Affected))
	for i, a := range preview.Affected {
		affected[i] = resumedefs.LanguageAwareDeletePreviewActionResAffected{Relation: a.Relation, Count: a.Count}
	}
	return &resumedefs.LanguageAwareDeletePreviewActionResponse{
		Payload: fireback.GResponseSingleItem(resumedefs.LanguageAwareDeletePreviewActionRes{
			Message:  preview.Message,
			Affected: emigo.ArrayReplace(affected),
		}),
	}, nil
}

func LanguageAwareDeleteAction(c resumedefs.LanguageAwareDeleteActionRequest) (*resumedefs.LanguageAwareDeleteActionResponse, error) {
	if err := resumedefs.LanguageEntityActions.AwareDelete(fireback.GetDbRef(), c.Body.UniqueIds); err != nil {
		return nil, err
	}
	return &resumedefs.LanguageAwareDeleteActionResponse{Payload: map[string]any{"deleted": c.Body.UniqueIds}}, nil
}
