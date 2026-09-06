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

// The base class definition for skillEntity
type SkillEntity struct {
	Id                int64                  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId          string                 `gorm:"type:varchar(100);default:gen_random_uuid();unique" json:"uniqueId" yaml:"uniqueId"`
	Name              string                 `json:"name" yaml:"name"`
	Category          emigo.Nullable[string] `json:"category" yaml:"category"`
	Level             emigo.Nullable[string] `json:"level" yaml:"level"`
	YearsOfExperience emigo.Nullable[int]    `json:"yearsOfExperience" yaml:"yearsOfExperience"`
	// Longer free-text elaboration on the skill, if any.
	Description complexes.TString `json:"description" yaml:"description"`
}

func (x *SkillEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetSkillEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "name",
			Type: "string",
		},
		{
			Name: prefix + "category",
			Type: "enum?",
		},
		{
			Name: prefix + "level",
			Type: "enum?",
		},
		{
			Name: prefix + "years-of-experience",
			Type: "int?",
		},
		{
			Name:        prefix + "description",
			Type:        "complex",
			Description: "Longer free-text elaboration on the skill, if any.",
		},
	}
}
func CastSkillEntityFromCli(c emigo.CliCastable) SkillEntity {
	data := SkillEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
	}
	if c.IsSet("category") {
		emigo.ParseNullable(c.String("category"), &data.Category)
	}
	if c.IsSet("level") {
		emigo.ParseNullable(c.String("level"), &data.Level)
	}
	if c.IsSet("years-of-experience") {
		emigo.ParseNullable(c.String("years-of-experience"), &data.YearsOfExperience)
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
// SkillEntityCreateFn creates a new SkillEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func SkillEntityCreateFn(tx *gorm.DB, dto *SkillEntity) (*SkillEntity, error) {
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

// SkillEntityUpdateFn applies a partial update to the SkillEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// SkillEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func SkillEntityUpdateFn(tx *gorm.DB, uniqueId string, input SkillOptionalDto) (*SkillEntity, error) {
	var entity SkillEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Name.IsSet() {
			changes["Name"] = input.Name
		}
		if input.Category.IsSet() {
			changes["Category"] = input.Category
		}
		if input.Level.IsSet() {
			changes["Level"] = input.Level
		}
		if input.YearsOfExperience.IsSet() {
			changes["YearsOfExperience"] = input.YearsOfExperience
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
	var updated SkillEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// SkillEntityGetFn looks up a single SkillEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func SkillEntityGetFn(tx *gorm.DB, uniqueId string) (*SkillEntity, error) {
	var entity SkillEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// SkillEntityBrowseFn returns SkillEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func SkillEntityBrowseFn(tx *gorm.DB, qs SkillBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*SkillEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&SkillEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*SkillEntity
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

// SkillEntityAwareDeleteAffected reports one relation of SkillEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on SkillEntity itself, so deleting SkillEntity doesn't cascade into them.
type SkillEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// SkillEntityAwareDeletePreview is the result of SkillEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts SkillEntityAwareDeleteFn would delete/clear
// alongside the SkillEntity row(s) themselves.
type SkillEntityAwareDeletePreview struct {
	Message  string                           `json:"message"`
	Affected []SkillEntityAwareDeleteAffected `json:"affected"`
}

// SkillEntityAwareDeletePreviewFn looks up the SkillEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// SkillEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling SkillEntityAwareDeleteFn.
func SkillEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*SkillEntityAwareDeletePreview, error) {
	var rows []*SkillEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &SkillEntityAwareDeletePreview{Message: "No matching SkillEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []SkillEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d SkillEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &SkillEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// SkillEntityAwareDeleteFn deletes the SkillEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation SkillEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func SkillEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*SkillEntity
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
		return tx.Where("id IN ?", ids).Delete(&SkillEntity{}).Error
	})
}

// SkillEntityActionsSig bundles the actions available for SkillEntity. Extend this (and
// SkillEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type SkillEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *SkillEntity) (*SkillEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input SkillOptionalDto) (*SkillEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*SkillEntity, error)
	Browse             func(tx *gorm.DB, qs SkillBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*SkillEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*SkillEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var SkillEntityActions SkillEntityActionsSig = SkillEntityActionsSig{
	Create:             SkillEntityCreateFn,
	Update:             SkillEntityUpdateFn,
	Get:                SkillEntityGetFn,
	Browse:             SkillEntityBrowseFn,
	AwareDeletePreview: SkillEntityAwareDeletePreviewFn,
	AwareDelete:        SkillEntityAwareDeleteFn,
}
