package resumedefs

import (
	"encoding"
	"encoding/json"
	"fmt"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/emi/emigorm"
	"github.com/torabian/fireback/modules/fireback/complexes"
	"gorm.io/gorm"
)

// The base class definition for projectEntity
type ProjectEntity struct {
	Id       int64  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId string `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	// The work experience that this project is done based on that.
	Experience WorkExperienceEntity `gorm:"foreignKey:ExperienceId;references:Id;constraint:-" json:"experience" yaml:"experience"`
	// The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.
	Descriptions []*ProjectEntityDescriptions `gorm:"foreignKey:LinkerId;references:Id;constraint:OnDelete:CASCADE" json:"descriptions" yaml:"descriptions"`
	Name         string                       `json:"name" yaml:"name"`
	Role         complexes.TString            `json:"role" yaml:"role"`
	Summary      complexes.TString            `json:"summary" yaml:"summary"`
	StartDate    complexes.XDate              `json:"startDate" yaml:"startDate"`
	EndDate      complexes.XDate              `json:"endDate" yaml:"endDate"`
	Url          emigo.Nullable[string]       `json:"url" yaml:"url"`
	RepoUrl      emigo.Nullable[string]       `json:"repoUrl" yaml:"repoUrl"`
	ExperienceId int64                        `gorm:"index" json:"-" yaml:"-"`
}

// The base class definition for descriptions
type ProjectEntityDescriptions struct {
	Target    *TargetPositionEntity                 `gorm:"foreignKey:TargetId;references:Id" json:"target" yaml:"target"`
	Content   complexes.TString                     `json:"content" yaml:"content"`
	Skills    emigo.CollectionNullable[SkillEntity] `gorm:"-" json:"skills" yaml:"skills"`
	Id        int64                                 `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId  string                                `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	LinkerId  int64                                 `gorm:"index" json:"linkerId" yaml:"linkerId"`
	TargetId  int64                                 `gorm:"index" json:"-" yaml:"-"`
	SkillsRow []*SkillEntity                        `gorm:"many2many:project_skills;foreignKey:Id;references:Id" json:"-" yaml:"-"`
}

func (x *ProjectEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetProjectEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name:        prefix + "experience",
			Type:        "class?",
			Description: "The work experience that this project is done based on that.",
		},
		{
			Name:        prefix + "descriptions",
			Type:        "_list",
			Description: "The project description, based on the target profile. So you can emphesize more on backend or front-end part of the project.",
		},
		{
			Name: prefix + "name",
			Type: "string",
		},
		{
			Name: prefix + "role",
			Type: "complex",
		},
		{
			Name: prefix + "summary",
			Type: "complex",
		},
		{
			Name: prefix + "start-date",
			Type: "complex",
		},
		{
			Name: prefix + "end-date",
			Type: "complex",
		},
		{
			Name: prefix + "url",
			Type: "string?",
		},
		{
			Name: prefix + "repo-url",
			Type: "string?",
		},
		{
			Name: prefix + "experience-id",
			Type: "int64",
		},
	}
}
func CastProjectEntityFromCli(c emigo.CliCastable) ProjectEntity {
	data := ProjectEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
	}
	if c.IsSet("role") {
		if u, ok := any(&data.Role).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("role")))
		}
	}
	if c.IsSet("summary") {
		if u, ok := any(&data.Summary).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("summary")))
		}
	}
	if c.IsSet("start-date") {
		if u, ok := any(&data.StartDate).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("start-date")))
		}
	}
	if c.IsSet("end-date") {
		if u, ok := any(&data.EndDate).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("end-date")))
		}
	}
	if c.IsSet("url") {
		emigo.ParseNullable(c.String("url"), &data.Url)
	}
	if c.IsSet("repo-url") {
		emigo.ParseNullable(c.String("repo-url"), &data.RepoUrl)
	}
	if c.IsSet("experience-id") {
		data.ExperienceId = int64(c.Int64("experience-id"))
	}
	return data
}
func GetProjectEntityDescriptionsCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "target",
			Type: "class",
		},
		{
			Name: prefix + "content",
			Type: "complex",
		},
		{
			Name: prefix + "skills",
			Type: "collection?",
		},
		{
			Name: prefix + "id",
			Type: "int64",
		},
		{
			Name: prefix + "unique-id",
			Type: "string",
		},
		{
			Name: prefix + "linker-id",
			Type: "int64",
		},
		{
			Name: prefix + "target-id",
			Type: "int64",
		},
		{
			Name: prefix + "skills-row",
			Type: "complex",
		},
	}
}
func CastProjectEntityDescriptionsFromCli(c emigo.CliCastable) ProjectEntityDescriptions {
	data := ProjectEntityDescriptions{}
	if c.IsSet("content") {
		if u, ok := any(&data.Content).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("content")))
		}
	}
	if c.IsSet("skills") {
		data.Skills = emigo.CapturePossibleCollectionNullable(CastSkillEntityFromCli, "skills", c)
	}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("linker-id") {
		data.LinkerId = int64(c.Int64("linker-id"))
	}
	if c.IsSet("target-id") {
		data.TargetId = int64(c.Int64("target-id"))
	}
	if c.IsSet("skills-row") {
		if u, ok := any(&data.SkillsRow).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("skills-row")))
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
func (x *ProjectEntity) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// BeforeCreate assigns UniqueId a random UUID (v4) if the caller hasn't already set one -
// gorm calls this automatically from every Create()/Save() insert path (including the
// has-many/many-to-many reconcile helpers in emigorm, which persist child rows via
// tx.Save() directly rather than through a generated *CreateFn). This replaces relying
// on a DB-level column default (e.g. Postgres's gen_random_uuid()): sqlite and MySQL
// have no dialect-portable equivalent, so assigning it here instead works identically
// across every gorm dialect, with no SQL default expression at all.
func (x *ProjectEntityDescriptions) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// ProjectEntityCreateFn creates a new ProjectEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func ProjectEntityCreateFn(tx *gorm.DB, dto *ProjectEntity) (*ProjectEntity, error) {
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(dto).Error; err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return dto, nil
}

// ProjectEntityUpdateFn applies a partial update to the ProjectEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// ProjectEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func ProjectEntityUpdateFn(tx *gorm.DB, uniqueId string, input ProjectOptionalDto) (*ProjectEntity, error) {
	var entity ProjectEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Experience.IsSet() {
			selectorId := ""
			if input.Experience.Operation == "select" {
				if s, ok := input.Experience.Selector.(string); ok {
					selectorId = s
				}
			} else {
				selectorId = input.Experience.Item.UniqueId.OrDefault("")
			}
			if selectorId == "" {
				return fmt.Errorf("experience: updating a one/one? relation needs either {\"__operation\":\"select\",\"__selector\":...} or the target's own uniqueId in the payload")
			}
			resolvedId, err := emigorm.ReconcileOne[WorkExperienceEntity](tx, "select", selectorId, nil)
			if err != nil {
				return err
			}
			changes["ExperienceId"] = resolvedId
		}
		if input.Name.IsSet() {
			changes["Name"] = input.Name
		}
		changes["Role"] = input.Role
		changes["Summary"] = input.Summary
		changes["StartDate"] = input.StartDate
		changes["EndDate"] = input.EndDate
		if input.Url.IsSet() {
			changes["Url"] = input.Url
		}
		if input.RepoUrl.IsSet() {
			changes["RepoUrl"] = input.RepoUrl
		}
		if len(changes) > 0 {
			if err := tx.Model(&entity).Updates(changes).Error; err != nil {
				return err
			}
		}
		if input.Descriptions.IsSet() {
			items := make([]*ProjectEntityDescriptions, len(input.Descriptions.Items))
			for i := range input.Descriptions.Items {
				src := input.Descriptions.Items[i]
				item := &ProjectEntityDescriptions{
					UniqueId: src.UniqueId.OrDefault(""),
					Content:  src.Content,
				}
				if src.Target.IsSet() {
					selectorId := ""
					if src.Target.Operation == "select" {
						if s, ok := src.Target.Selector.(string); ok {
							selectorId = s
						}
					} else {
						selectorId = src.Target.Item.UniqueId.OrDefault("")
					}
					if selectorId == "" {
						return fmt.Errorf("descriptions.target: updating a one/one? relation needs either {\"__operation\":\"select\",\"__selector\":...} or the target's own uniqueId in the payload")
					}
					resolvedId, err := emigorm.ReconcileOne[TargetPositionEntity](tx, "select", selectorId, nil)
					if err != nil {
						return err
					}
					item.TargetId = resolvedId
				}
				items[i] = item
			}
			if err := emigorm.ReconcileHasMany(tx, "linker_id", entity.Id, input.Descriptions.Operation, items); err != nil {
				return err
			}
			for i := range items {
				src := input.Descriptions.Items[i]
				item := items[i]
				if src.Skills.IsSet() {
					subItems := make([]*SkillEntity, len(src.Skills.Items))
					for j := range src.Skills.Items {
						uid := src.Skills.Items[j].UniqueId.OrDefault("")
						if uid == "" {
							return fmt.Errorf("descriptions.skills: updating a collection/collection? relation only supports referencing existing rows by uniqueId, item %d has none", j)
						}
						var existing SkillEntity
						if err := tx.First(&existing, "unique_id = ?", uid).Error; err != nil {
							return err
						}
						subItems[j] = &existing
					}
					if err := emigorm.ReconcileManyToMany(tx, item, "SkillsRow", src.Skills.Operation, subItems); err != nil {
						return err
					}
				}
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	var updated ProjectEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// ProjectEntityGetFn looks up a single ProjectEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func ProjectEntityGetFn(tx *gorm.DB, uniqueId string) (*ProjectEntity, error) {
	var entity ProjectEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// ProjectEntityBrowseFn returns ProjectEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func ProjectEntityBrowseFn(tx *gorm.DB, qs ProjectBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*ProjectEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&ProjectEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*ProjectEntity
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

// ProjectEntityAwareDeleteAffected reports one relation of ProjectEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on ProjectEntity itself, so deleting ProjectEntity doesn't cascade into them.
type ProjectEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// ProjectEntityAwareDeletePreview is the result of ProjectEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts ProjectEntityAwareDeleteFn would delete/clear
// alongside the ProjectEntity row(s) themselves.
type ProjectEntityAwareDeletePreview struct {
	Message  string                             `json:"message"`
	Affected []ProjectEntityAwareDeleteAffected `json:"affected"`
}

// ProjectEntityAwareDeletePreviewFn looks up the ProjectEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// ProjectEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling ProjectEntityAwareDeleteFn.
func ProjectEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*ProjectEntityAwareDeletePreview, error) {
	var rows []*ProjectEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &ProjectEntityAwareDeletePreview{Message: "No matching ProjectEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []ProjectEntityAwareDeleteAffected{}
	var total int64
	var affected0 int64
	tx.Model(&ProjectEntityDescriptions{}).Where("linker_id IN ?", ids).Count(&affected0)
	if affected0 > 0 {
		affected = append(affected, ProjectEntityAwareDeleteAffected{Relation: "descriptions", Count: affected0})
		total += affected0
	}
	message := fmt.Sprintf("Deleting %d ProjectEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &ProjectEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// ProjectEntityAwareDeleteFn deletes the ProjectEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation ProjectEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func ProjectEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*ProjectEntity
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
		if err := tx.Where("linker_id IN ?", ids).Delete(&ProjectEntityDescriptions{}).Error; err != nil {
			return err
		}
		return tx.Where("id IN ?", ids).Delete(&ProjectEntity{}).Error
	})
}

// ProjectEntityActionsSig bundles the actions available for ProjectEntity. Extend this (and
// ProjectEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type ProjectEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *ProjectEntity) (*ProjectEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input ProjectOptionalDto) (*ProjectEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*ProjectEntity, error)
	Browse             func(tx *gorm.DB, qs ProjectBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*ProjectEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*ProjectEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var ProjectEntityActions ProjectEntityActionsSig = ProjectEntityActionsSig{
	Create:             ProjectEntityCreateFn,
	Update:             ProjectEntityUpdateFn,
	Get:                ProjectEntityGetFn,
	Browse:             ProjectEntityBrowseFn,
	AwareDeletePreview: ProjectEntityAwareDeletePreviewFn,
	AwareDelete:        ProjectEntityAwareDeleteFn,
}
