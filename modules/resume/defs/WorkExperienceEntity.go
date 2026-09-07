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

// The base class definition for workExperienceEntity
type WorkExperienceEntity struct {
	Id             int64                  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId       string                 `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	Company        complexes.TString      `json:"company" yaml:"company"`
	JobTitle       complexes.TString      `json:"jobTitle" yaml:"jobTitle"`
	EmploymentType emigo.Nullable[string] `json:"employmentType" yaml:"employmentType"`
	Location       complexes.TString      `json:"location" yaml:"location"`
	Remote         emigo.Nullable[bool]   `json:"remote" yaml:"remote"`
	// ISO-8601 date, e.g. "2021-03-01".
	StartDate complexes.XDate `json:"startDate" yaml:"startDate"`
	// ISO-8601 date. Empty/omitted when isCurrent is true.
	EndDate      complexes.XDate          `json:"endDate" yaml:"endDate"`
	Achievements emigo.Nullable[[]string] `json:"achievements" yaml:"achievements"`
}

func (x *WorkExperienceEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetWorkExperienceEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "company",
			Type: "complex",
		},
		{
			Name: prefix + "job-title",
			Type: "complex",
		},
		{
			Name: prefix + "employment-type",
			Type: "enum?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name: prefix + "remote",
			Type: "bool?",
		},
		{
			Name:        prefix + "start-date",
			Type:        "complex",
			Description: "ISO-8601 date, e.g. \"2021-03-01\".",
		},
		{
			Name:        prefix + "end-date",
			Type:        "complex",
			Description: "ISO-8601 date. Empty/omitted when isCurrent is true.",
		},
		{
			Name: prefix + "achievements",
			Type: "slice?",
		},
	}
}
func CastWorkExperienceEntityFromCli(c emigo.CliCastable) WorkExperienceEntity {
	data := WorkExperienceEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("company") {
		if u, ok := any(&data.Company).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("company")))
		}
	}
	if c.IsSet("job-title") {
		if u, ok := any(&data.JobTitle).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("job-title")))
		}
	}
	if c.IsSet("employment-type") {
		emigo.ParseNullable(c.String("employment-type"), &data.EmploymentType)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
		}
	}
	if c.IsSet("remote") {
		emigo.ParseNullable(c.String("remote"), &data.Remote)
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
	if c.IsSet("achievements") {
		emigo.ParseNullable(c.String("achievements"), &data.Achievements)
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
func (x *WorkExperienceEntity) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// WorkExperienceEntityCreateFn creates a new WorkExperienceEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func WorkExperienceEntityCreateFn(tx *gorm.DB, dto *WorkExperienceEntity) (*WorkExperienceEntity, error) {
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

// WorkExperienceEntityUpdateFn applies a partial update to the WorkExperienceEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// WorkExperienceEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func WorkExperienceEntityUpdateFn(tx *gorm.DB, uniqueId string, input WorkExperienceOptionalDto) (*WorkExperienceEntity, error) {
	var entity WorkExperienceEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		changes["Company"] = input.Company
		changes["JobTitle"] = input.JobTitle
		if input.EmploymentType.IsSet() {
			changes["EmploymentType"] = input.EmploymentType
		}
		changes["Location"] = input.Location
		if input.Remote.IsSet() {
			changes["Remote"] = input.Remote
		}
		changes["StartDate"] = input.StartDate
		changes["EndDate"] = input.EndDate
		if input.Achievements.IsSet() {
			changes["Achievements"] = input.Achievements
		}
		if len(changes) > 0 {
			if err := tx.Model(&entity).Updates(changes).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	var updated WorkExperienceEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// WorkExperienceEntityGetFn looks up a single WorkExperienceEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func WorkExperienceEntityGetFn(tx *gorm.DB, uniqueId string) (*WorkExperienceEntity, error) {
	var entity WorkExperienceEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// WorkExperienceEntityBrowseFn returns WorkExperienceEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func WorkExperienceEntityBrowseFn(tx *gorm.DB, qs WorkExperienceBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*WorkExperienceEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&WorkExperienceEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*WorkExperienceEntity
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

// WorkExperienceEntityAwareDeleteAffected reports one relation of WorkExperienceEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on WorkExperienceEntity itself, so deleting WorkExperienceEntity doesn't cascade into them.
type WorkExperienceEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// WorkExperienceEntityAwareDeletePreview is the result of WorkExperienceEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts WorkExperienceEntityAwareDeleteFn would delete/clear
// alongside the WorkExperienceEntity row(s) themselves.
type WorkExperienceEntityAwareDeletePreview struct {
	Message  string                                    `json:"message"`
	Affected []WorkExperienceEntityAwareDeleteAffected `json:"affected"`
}

// WorkExperienceEntityAwareDeletePreviewFn looks up the WorkExperienceEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// WorkExperienceEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling WorkExperienceEntityAwareDeleteFn.
func WorkExperienceEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*WorkExperienceEntityAwareDeletePreview, error) {
	var rows []*WorkExperienceEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &WorkExperienceEntityAwareDeletePreview{Message: "No matching WorkExperienceEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []WorkExperienceEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d WorkExperienceEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &WorkExperienceEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// WorkExperienceEntityAwareDeleteFn deletes the WorkExperienceEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation WorkExperienceEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func WorkExperienceEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*WorkExperienceEntity
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
		return tx.Where("id IN ?", ids).Delete(&WorkExperienceEntity{}).Error
	})
}

// WorkExperienceEntityActionsSig bundles the actions available for WorkExperienceEntity. Extend this (and
// WorkExperienceEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type WorkExperienceEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *WorkExperienceEntity) (*WorkExperienceEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input WorkExperienceOptionalDto) (*WorkExperienceEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*WorkExperienceEntity, error)
	Browse             func(tx *gorm.DB, qs WorkExperienceBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*WorkExperienceEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*WorkExperienceEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var WorkExperienceEntityActions WorkExperienceEntityActionsSig = WorkExperienceEntityActionsSig{
	Create:             WorkExperienceEntityCreateFn,
	Update:             WorkExperienceEntityUpdateFn,
	Get:                WorkExperienceEntityGetFn,
	Browse:             WorkExperienceEntityBrowseFn,
	AwareDeletePreview: WorkExperienceEntityAwareDeletePreviewFn,
	AwareDelete:        WorkExperienceEntityAwareDeleteFn,
}
