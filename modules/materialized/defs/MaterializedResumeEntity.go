package materializeddefs

import (
	"encoding"
	"encoding/json"
	"fmt"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/emi/emigorm"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"gorm.io/gorm"
)

// The base class definition for materializedResumeEntity
type MaterializedResumeEntity struct {
	Id       int64  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId string `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	// Label for this variant, e.g. "Backend-focused - Acme Corp application".
	Title string `json:"title" yaml:"title"`
	// The role/company this variant was tailored for, if any.
	TargetRole emigo.Nullable[string] `json:"targetRole" yaml:"targetRole"`
	// The base Resume this variant is assembled from.
	Resume             *resumedefs.ResumeEntity                                  `gorm:"foreignKey:ResumeId;references:Id" json:"resume" yaml:"resume"`
	WorkExperiences    emigo.CollectionNullable[resumedefs.WorkExperienceEntity] `gorm:"-" json:"workExperiences" yaml:"workExperiences"`
	Educations         emigo.CollectionNullable[resumedefs.EducationEntity]      `gorm:"-" json:"educations" yaml:"educations"`
	Skills             emigo.CollectionNullable[resumedefs.SkillEntity]          `gorm:"-" json:"skills" yaml:"skills"`
	Projects           emigo.CollectionNullable[resumedefs.ProjectEntity]        `gorm:"-" json:"projects" yaml:"projects"`
	Certifications     emigo.CollectionNullable[resumedefs.CertificationEntity]  `gorm:"-" json:"certifications" yaml:"certifications"`
	Languages          emigo.CollectionNullable[resumedefs.LanguageEntity]       `gorm:"-" json:"languages" yaml:"languages"`
	ResumeId           int64                                                     `gorm:"index" json:"-" yaml:"-"`
	WorkExperiencesRow []*resumedefs.WorkExperienceEntity                        `gorm:"many2many:materializedResume_workExperiences;foreignKey:Id;references:Id" json:"-" yaml:"-"`
	EducationsRow      []*resumedefs.EducationEntity                             `gorm:"many2many:materializedResume_educations;foreignKey:Id;references:Id" json:"-" yaml:"-"`
	SkillsRow          []*resumedefs.SkillEntity                                 `gorm:"many2many:materializedResume_skills;foreignKey:Id;references:Id" json:"-" yaml:"-"`
	ProjectsRow        []*resumedefs.ProjectEntity                               `gorm:"many2many:materializedResume_projects;foreignKey:Id;references:Id" json:"-" yaml:"-"`
	CertificationsRow  []*resumedefs.CertificationEntity                         `gorm:"many2many:materializedResume_certifications;foreignKey:Id;references:Id" json:"-" yaml:"-"`
	LanguagesRow       []*resumedefs.LanguageEntity                              `gorm:"many2many:materializedResume_languages;foreignKey:Id;references:Id" json:"-" yaml:"-"`
}

func (x *MaterializedResumeEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetMaterializedResumeEntityCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "id",
			Type: "int64",
		},
		{
			Name: prefix + "unique-id",
			Type: "string",
		},
		{
			Name:        prefix + "title",
			Type:        "string",
			Description: "Label for this variant, e.g. \"Backend-focused - Acme Corp application\".",
		},
		{
			Name:        prefix + "target-role",
			Type:        "string?",
			Description: "The role/company this variant was tailored for, if any.",
		},
		{
			Name:        prefix + "resume",
			Type:        "class",
			Description: "The base Resume this variant is assembled from.",
		},
		{
			Name: prefix + "work-experiences",
			Type: "collection?",
		},
		{
			Name: prefix + "educations",
			Type: "collection?",
		},
		{
			Name: prefix + "skills",
			Type: "collection?",
		},
		{
			Name: prefix + "projects",
			Type: "collection?",
		},
		{
			Name: prefix + "certifications",
			Type: "collection?",
		},
		{
			Name: prefix + "languages",
			Type: "collection?",
		},
		{
			Name: prefix + "resume-id",
			Type: "int64",
		},
		{
			Name: prefix + "work-experiences-row",
			Type: "complex",
		},
		{
			Name: prefix + "educations-row",
			Type: "complex",
		},
		{
			Name: prefix + "skills-row",
			Type: "complex",
		},
		{
			Name: prefix + "projects-row",
			Type: "complex",
		},
		{
			Name: prefix + "certifications-row",
			Type: "complex",
		},
		{
			Name: prefix + "languages-row",
			Type: "complex",
		},
	}
}
func CastMaterializedResumeEntityFromCli(c emigo.CliCastable) MaterializedResumeEntity {
	data := MaterializedResumeEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("title") {
		data.Title = c.String("title")
	}
	if c.IsSet("target-role") {
		emigo.ParseNullable(c.String("target-role"), &data.TargetRole)
	}
	if c.IsSet("work-experiences") {
		data.WorkExperiences = emigo.CapturePossibleCollectionNullable(resumedefs.CastWorkExperienceEntityFromCli, "work-experiences", c)
	}
	if c.IsSet("educations") {
		data.Educations = emigo.CapturePossibleCollectionNullable(resumedefs.CastEducationEntityFromCli, "educations", c)
	}
	if c.IsSet("skills") {
		data.Skills = emigo.CapturePossibleCollectionNullable(resumedefs.CastSkillEntityFromCli, "skills", c)
	}
	if c.IsSet("projects") {
		data.Projects = emigo.CapturePossibleCollectionNullable(resumedefs.CastProjectEntityFromCli, "projects", c)
	}
	if c.IsSet("certifications") {
		data.Certifications = emigo.CapturePossibleCollectionNullable(resumedefs.CastCertificationEntityFromCli, "certifications", c)
	}
	if c.IsSet("languages") {
		data.Languages = emigo.CapturePossibleCollectionNullable(resumedefs.CastLanguageEntityFromCli, "languages", c)
	}
	if c.IsSet("resume-id") {
		data.ResumeId = int64(c.Int64("resume-id"))
	}
	if c.IsSet("work-experiences-row") {
		if u, ok := any(&data.WorkExperiencesRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("work-experiences-row")))
		}
	}
	if c.IsSet("educations-row") {
		if u, ok := any(&data.EducationsRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("educations-row")))
		}
	}
	if c.IsSet("skills-row") {
		if u, ok := any(&data.SkillsRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("skills-row")))
		}
	}
	if c.IsSet("projects-row") {
		if u, ok := any(&data.ProjectsRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("projects-row")))
		}
	}
	if c.IsSet("certifications-row") {
		if u, ok := any(&data.CertificationsRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("certifications-row")))
		}
	}
	if c.IsSet("languages-row") {
		if u, ok := any(&data.LanguagesRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("languages-row")))
		}
	}
	return data
}

// Extra entity-specific code (hooks, custom methods, business logic, etc.) can be
// appended here in this template, after the struct GoCommonStructGenerator produced.
// BeforeCreate assigns UniqueId a random UUID (v4) if the caller hasn't already set one -
// gorm calls this automatically from every Create()/Save() insert path (including the
// has-many/many-to-many reconcile helpers in emigorm, which persist child rows via
// tx.Save() directly rather than through a generated *CreateFn). This replaces relying
// on a DB-level column default (e.g. Postgres's gen_random_uuid()): sqlite and MySQL
// have no dialect-portable equivalent, so assigning it here instead works identically
// across every gorm dialect, with no SQL default expression at all.
func (x *MaterializedResumeEntity) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// MaterializedResumeEntityCreateFn creates a new MaterializedResumeEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func MaterializedResumeEntityCreateFn(tx *gorm.DB, dto *MaterializedResumeEntity) (*MaterializedResumeEntity, error) {
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(dto).Error; err != nil {
			return err
		}
		if dto.WorkExperiences.IsSet() {
			items := make([]*resumedefs.WorkExperienceEntity, len(dto.WorkExperiences.Items))
			for i := range dto.WorkExperiences.Items {
				items[i] = &dto.WorkExperiences.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "WorkExperiencesRow", dto.WorkExperiences.Operation, items); err != nil {
				return err
			}
		}
		if dto.Educations.IsSet() {
			items := make([]*resumedefs.EducationEntity, len(dto.Educations.Items))
			for i := range dto.Educations.Items {
				items[i] = &dto.Educations.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "EducationsRow", dto.Educations.Operation, items); err != nil {
				return err
			}
		}
		if dto.Skills.IsSet() {
			items := make([]*resumedefs.SkillEntity, len(dto.Skills.Items))
			for i := range dto.Skills.Items {
				items[i] = &dto.Skills.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "SkillsRow", dto.Skills.Operation, items); err != nil {
				return err
			}
		}
		if dto.Projects.IsSet() {
			items := make([]*resumedefs.ProjectEntity, len(dto.Projects.Items))
			for i := range dto.Projects.Items {
				items[i] = &dto.Projects.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "ProjectsRow", dto.Projects.Operation, items); err != nil {
				return err
			}
		}
		if dto.Certifications.IsSet() {
			items := make([]*resumedefs.CertificationEntity, len(dto.Certifications.Items))
			for i := range dto.Certifications.Items {
				items[i] = &dto.Certifications.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "CertificationsRow", dto.Certifications.Operation, items); err != nil {
				return err
			}
		}
		if dto.Languages.IsSet() {
			items := make([]*resumedefs.LanguageEntity, len(dto.Languages.Items))
			for i := range dto.Languages.Items {
				items[i] = &dto.Languages.Items[i]
			}
			if err := emigorm.ReconcileManyToMany(tx, dto, "LanguagesRow", dto.Languages.Operation, items); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return dto, nil
}

// MaterializedResumeEntityUpdateFn applies a partial update to the MaterializedResumeEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// MaterializedResumeEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func MaterializedResumeEntityUpdateFn(tx *gorm.DB, uniqueId string, input MaterializedResumeOptionalDto) (*MaterializedResumeEntity, error) {
	var entity MaterializedResumeEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Resume.IsSet() {
			selectorId := ""
			if input.Resume.Operation == "select" {
				if s, ok := input.Resume.Selector.(string); ok {
					selectorId = s
				}
			} else {
				selectorId = input.Resume.Item.UniqueId.OrDefault("")
			}
			if selectorId == "" {
				return fmt.Errorf("resume: updating a one/one? relation needs either {\"__operation\":\"select\",\"__selector\":...} or the target's own uniqueId in the payload")
			}
			resolvedId, err := emigorm.ReconcileOne[resumedefs.ResumeEntity](tx, "select", selectorId, nil)
			if err != nil {
				return err
			}
			changes["ResumeId"] = resolvedId
		}
		if input.Title.IsSet() {
			changes["Title"] = input.Title
		}
		if input.TargetRole.IsSet() {
			changes["TargetRole"] = input.TargetRole
		}
		if len(changes) > 0 {
			if err := tx.Model(&entity).Updates(changes).Error; err != nil {
				return err
			}
		}
		if input.WorkExperiences.IsSet() {
			items := make([]*resumedefs.WorkExperienceEntity, len(input.WorkExperiences.Items))
			for i := range input.WorkExperiences.Items {
				uid := input.WorkExperiences.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("workExperiences: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.WorkExperienceEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "WorkExperiencesRow", input.WorkExperiences.Operation, items); err != nil {
				return err
			}
		}
		if input.Educations.IsSet() {
			items := make([]*resumedefs.EducationEntity, len(input.Educations.Items))
			for i := range input.Educations.Items {
				uid := input.Educations.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("educations: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.EducationEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "EducationsRow", input.Educations.Operation, items); err != nil {
				return err
			}
		}
		if input.Skills.IsSet() {
			items := make([]*resumedefs.SkillEntity, len(input.Skills.Items))
			for i := range input.Skills.Items {
				uid := input.Skills.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("skills: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.SkillEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "SkillsRow", input.Skills.Operation, items); err != nil {
				return err
			}
		}
		if input.Projects.IsSet() {
			items := make([]*resumedefs.ProjectEntity, len(input.Projects.Items))
			for i := range input.Projects.Items {
				uid := input.Projects.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("projects: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.ProjectEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "ProjectsRow", input.Projects.Operation, items); err != nil {
				return err
			}
		}
		if input.Certifications.IsSet() {
			items := make([]*resumedefs.CertificationEntity, len(input.Certifications.Items))
			for i := range input.Certifications.Items {
				uid := input.Certifications.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("certifications: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.CertificationEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "CertificationsRow", input.Certifications.Operation, items); err != nil {
				return err
			}
		}
		if input.Languages.IsSet() {
			items := make([]*resumedefs.LanguageEntity, len(input.Languages.Items))
			for i := range input.Languages.Items {
				uid := input.Languages.Items[i].UniqueId.OrDefault("")
				if uid == "" {
					return fmt.Errorf("languages: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", i)
				}
				var existing resumedefs.LanguageEntity
				if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
					return err
				}
				items[i] = &existing
			}
			if err := emigorm.ReconcileManyToMany(tx, &entity, "LanguagesRow", input.Languages.Operation, items); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	var updated MaterializedResumeEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// MaterializedResumeEntityGetFn looks up a single MaterializedResumeEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func MaterializedResumeEntityGetFn(tx *gorm.DB, uniqueId string) (*MaterializedResumeEntity, error) {
	var entity MaterializedResumeEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// MaterializedResumeEntityBrowseFn returns MaterializedResumeEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func MaterializedResumeEntityBrowseFn(tx *gorm.DB, qs MaterializedResumeBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*MaterializedResumeEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&MaterializedResumeEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*MaterializedResumeEntity
	paged := emigorm.ApplyQueryPage(emigorm.ApplyQueryCursor(emigorm.ApplyQuerySort(filtered, qs.Sort), qs.Cursor), qs.StartIndex, qs.ItemsPerPage)
	if err := paged.Find(&items).Error; err != nil {
		return nil, nil, err
	}
	meta := &emigo.QueryResultMeta{
		TotalItems: total,
		Cursor:     emigorm.BuildQueryCursor(items),
	}
	return items, meta, nil
}

// MaterializedResumeEntityAwareDeleteAffected reports one relation of MaterializedResumeEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on MaterializedResumeEntity itself, so deleting MaterializedResumeEntity doesn't cascade into them.
type MaterializedResumeEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// MaterializedResumeEntityAwareDeletePreview is the result of MaterializedResumeEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts MaterializedResumeEntityAwareDeleteFn would delete/clear
// alongside the MaterializedResumeEntity row(s) themselves.
type MaterializedResumeEntityAwareDeletePreview struct {
	Message  string                                        `json:"message"`
	Affected []MaterializedResumeEntityAwareDeleteAffected `json:"affected"`
}

// MaterializedResumeEntityAwareDeletePreviewFn looks up the MaterializedResumeEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// MaterializedResumeEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling MaterializedResumeEntityAwareDeleteFn.
func MaterializedResumeEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*MaterializedResumeEntityAwareDeletePreview, error) {
	var rows []*MaterializedResumeEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &MaterializedResumeEntityAwareDeletePreview{Message: "No matching MaterializedResumeEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []MaterializedResumeEntityAwareDeleteAffected{}
	var total int64
	var affected0 int64
	for i := range rows {
		affected0 += tx.Model(rows[i]).Association("WorkExperiencesRow").Count()
	}
	if affected0 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "workExperiences", Count: affected0})
		total += affected0
	}
	var affected1 int64
	for i := range rows {
		affected1 += tx.Model(rows[i]).Association("EducationsRow").Count()
	}
	if affected1 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "educations", Count: affected1})
		total += affected1
	}
	var affected2 int64
	for i := range rows {
		affected2 += tx.Model(rows[i]).Association("SkillsRow").Count()
	}
	if affected2 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "skills", Count: affected2})
		total += affected2
	}
	var affected3 int64
	for i := range rows {
		affected3 += tx.Model(rows[i]).Association("ProjectsRow").Count()
	}
	if affected3 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "projects", Count: affected3})
		total += affected3
	}
	var affected4 int64
	for i := range rows {
		affected4 += tx.Model(rows[i]).Association("CertificationsRow").Count()
	}
	if affected4 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "certifications", Count: affected4})
		total += affected4
	}
	var affected5 int64
	for i := range rows {
		affected5 += tx.Model(rows[i]).Association("LanguagesRow").Count()
	}
	if affected5 > 0 {
		affected = append(affected, MaterializedResumeEntityAwareDeleteAffected{Relation: "languages", Count: affected5})
		total += affected5
	}
	message := fmt.Sprintf("Deleting %d MaterializedResumeEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &MaterializedResumeEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// MaterializedResumeEntityAwareDeleteFn deletes the MaterializedResumeEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation MaterializedResumeEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func MaterializedResumeEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*MaterializedResumeEntity
		if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
			return err
		}
		if len(rows) == 0 {
			return nil
		}
		ids := make([]int64, len(rows))
		for i := range rows {
			ids[i] = rows[i].Id
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("WorkExperiencesRow").Clear(); err != nil {
				return err
			}
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("EducationsRow").Clear(); err != nil {
				return err
			}
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("SkillsRow").Clear(); err != nil {
				return err
			}
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("ProjectsRow").Clear(); err != nil {
				return err
			}
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("CertificationsRow").Clear(); err != nil {
				return err
			}
		}
		for i := range rows {
			if err := tx.Model(rows[i]).Association("LanguagesRow").Clear(); err != nil {
				return err
			}
		}
		return tx.Where("id IN ?", ids).Delete(&MaterializedResumeEntity{}).Error
	})
}

// MaterializedResumeEntityActionsSig bundles the actions available for MaterializedResumeEntity. Extend this (and
// MaterializedResumeEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type MaterializedResumeEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *MaterializedResumeEntity) (*MaterializedResumeEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input MaterializedResumeOptionalDto) (*MaterializedResumeEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*MaterializedResumeEntity, error)
	Browse             func(tx *gorm.DB, qs MaterializedResumeBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*MaterializedResumeEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*MaterializedResumeEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var MaterializedResumeEntityActions MaterializedResumeEntityActionsSig = MaterializedResumeEntityActionsSig{
	Create:             MaterializedResumeEntityCreateFn,
	Update:             MaterializedResumeEntityUpdateFn,
	Get:                MaterializedResumeEntityGetFn,
	Browse:             MaterializedResumeEntityBrowseFn,
	AwareDeletePreview: MaterializedResumeEntityAwareDeletePreviewFn,
	AwareDelete:        MaterializedResumeEntityAwareDeleteFn,
}
