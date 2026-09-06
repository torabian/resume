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

// The base class definition for educationEntity
type EducationEntity struct {
	Id          int64  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId    string `gorm:"type:varchar(100);default:gen_random_uuid();unique" json:"uniqueId" yaml:"uniqueId"`
	Institution string `json:"institution" yaml:"institution"`
	// e.g. "B.Sc.", "M.Sc.", "Bootcamp certificate".
	Degree       complexes.TString      `json:"degree" yaml:"degree"`
	FieldOfStudy complexes.TString      `json:"fieldOfStudy" yaml:"fieldOfStudy"`
	Location     complexes.TString      `json:"location" yaml:"location"`
	StartDate    complexes.XDate        `json:"startDate" yaml:"startDate"`
	EndDate      complexes.XDate        `json:"endDate" yaml:"endDate"`
	IsCurrent    emigo.Nullable[bool]   `json:"isCurrent" yaml:"isCurrent"`
	Grade        emigo.Nullable[string] `json:"grade" yaml:"grade"`
	Description  complexes.TString      `json:"description" yaml:"description"`
}

func (x *EducationEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetEducationEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "institution",
			Type: "string",
		},
		{
			Name:        prefix + "degree",
			Type:        "complex",
			Description: "e.g. \"B.Sc.\", \"M.Sc.\", \"Bootcamp certificate\".",
		},
		{
			Name: prefix + "field-of-study",
			Type: "complex",
		},
		{
			Name: prefix + "location",
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
			Name: prefix + "is-current",
			Type: "bool?",
		},
		{
			Name: prefix + "grade",
			Type: "string?",
		},
		{
			Name: prefix + "description",
			Type: "complex",
		},
	}
}
func CastEducationEntityFromCli(c emigo.CliCastable) EducationEntity {
	data := EducationEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("institution") {
		data.Institution = c.String("institution")
	}
	if c.IsSet("degree") {
		if u, ok := any(&data.Degree).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("degree")))
		}
	}
	if c.IsSet("field-of-study") {
		if u, ok := any(&data.FieldOfStudy).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("field-of-study")))
		}
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
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
	if c.IsSet("is-current") {
		emigo.ParseNullable(c.String("is-current"), &data.IsCurrent)
	}
	if c.IsSet("grade") {
		emigo.ParseNullable(c.String("grade"), &data.Grade)
	}
	if c.IsSet("description") {
		if u, ok := any(&data.Description).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("description")))
		}
	}
	return data
}

// Extra entity-specific code (hooks, custom methods, business logic, etc.) can be
// appended here in this template, after the struct GoCommonStructGenerator produced.
// EducationEntityCreateFn creates a new EducationEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func EducationEntityCreateFn(tx *gorm.DB, dto *EducationEntity) (*EducationEntity, error) {
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

// EducationEntityUpdateFn applies a partial update to the EducationEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// EducationEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func EducationEntityUpdateFn(tx *gorm.DB, uniqueId string, input EducationOptionalDto) (*EducationEntity, error) {
	var entity EducationEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Institution.IsSet() {
			changes["Institution"] = input.Institution
		}
		changes["Degree"] = input.Degree
		changes["FieldOfStudy"] = input.FieldOfStudy
		changes["Location"] = input.Location
		changes["StartDate"] = input.StartDate
		changes["EndDate"] = input.EndDate
		if input.IsCurrent.IsSet() {
			changes["IsCurrent"] = input.IsCurrent
		}
		if input.Grade.IsSet() {
			changes["Grade"] = input.Grade
		}
		changes["Description"] = input.Description
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
	var updated EducationEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// EducationEntityGetFn looks up a single EducationEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func EducationEntityGetFn(tx *gorm.DB, uniqueId string) (*EducationEntity, error) {
	var entity EducationEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// EducationEntityBrowseFn returns EducationEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func EducationEntityBrowseFn(tx *gorm.DB, qs EducationBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*EducationEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&EducationEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*EducationEntity
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

// EducationEntityAwareDeleteAffected reports one relation of EducationEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on EducationEntity itself, so deleting EducationEntity doesn't cascade into them.
type EducationEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// EducationEntityAwareDeletePreview is the result of EducationEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts EducationEntityAwareDeleteFn would delete/clear
// alongside the EducationEntity row(s) themselves.
type EducationEntityAwareDeletePreview struct {
	Message  string                               `json:"message"`
	Affected []EducationEntityAwareDeleteAffected `json:"affected"`
}

// EducationEntityAwareDeletePreviewFn looks up the EducationEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// EducationEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling EducationEntityAwareDeleteFn.
func EducationEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*EducationEntityAwareDeletePreview, error) {
	var rows []*EducationEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &EducationEntityAwareDeletePreview{Message: "No matching EducationEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []EducationEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d EducationEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &EducationEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// EducationEntityAwareDeleteFn deletes the EducationEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation EducationEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func EducationEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*EducationEntity
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
		return tx.Where("id IN ?", ids).Delete(&EducationEntity{}).Error
	})
}

// EducationEntityActionsSig bundles the actions available for EducationEntity. Extend this (and
// EducationEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type EducationEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *EducationEntity) (*EducationEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input EducationOptionalDto) (*EducationEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*EducationEntity, error)
	Browse             func(tx *gorm.DB, qs EducationBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*EducationEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*EducationEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var EducationEntityActions EducationEntityActionsSig = EducationEntityActionsSig{
	Create:             EducationEntityCreateFn,
	Update:             EducationEntityUpdateFn,
	Get:                EducationEntityGetFn,
	Browse:             EducationEntityBrowseFn,
	AwareDeletePreview: EducationEntityAwareDeletePreviewFn,
	AwareDelete:        EducationEntityAwareDeleteFn,
}
