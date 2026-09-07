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

// The base class definition for targetPositionEntity
type TargetPositionEntity struct {
	Id       int64             `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId string            `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	Name     complexes.TString `json:"name" yaml:"name"`
}

func (x *TargetPositionEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetTargetPositionEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Type: "complex",
		},
	}
}
func CastTargetPositionEntityFromCli(c emigo.CliCastable) TargetPositionEntity {
	data := TargetPositionEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("name") {
		if u, ok := any(&data.Name).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("name")))
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
func (x *TargetPositionEntity) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// TargetPositionEntityCreateFn creates a new TargetPositionEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func TargetPositionEntityCreateFn(tx *gorm.DB, dto *TargetPositionEntity) (*TargetPositionEntity, error) {
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

// TargetPositionEntityUpdateFn applies a partial update to the TargetPositionEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// TargetPositionEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func TargetPositionEntityUpdateFn(tx *gorm.DB, uniqueId string, input TargetPositionOptionalDto) (*TargetPositionEntity, error) {
	var entity TargetPositionEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		changes["Name"] = input.Name
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
	var updated TargetPositionEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// TargetPositionEntityGetFn looks up a single TargetPositionEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func TargetPositionEntityGetFn(tx *gorm.DB, uniqueId string) (*TargetPositionEntity, error) {
	var entity TargetPositionEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// TargetPositionEntityBrowseFn returns TargetPositionEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func TargetPositionEntityBrowseFn(tx *gorm.DB, qs TargetPositionBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*TargetPositionEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&TargetPositionEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*TargetPositionEntity
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

// TargetPositionEntityAwareDeleteAffected reports one relation of TargetPositionEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on TargetPositionEntity itself, so deleting TargetPositionEntity doesn't cascade into them.
type TargetPositionEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// TargetPositionEntityAwareDeletePreview is the result of TargetPositionEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts TargetPositionEntityAwareDeleteFn would delete/clear
// alongside the TargetPositionEntity row(s) themselves.
type TargetPositionEntityAwareDeletePreview struct {
	Message  string                                    `json:"message"`
	Affected []TargetPositionEntityAwareDeleteAffected `json:"affected"`
}

// TargetPositionEntityAwareDeletePreviewFn looks up the TargetPositionEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// TargetPositionEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling TargetPositionEntityAwareDeleteFn.
func TargetPositionEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*TargetPositionEntityAwareDeletePreview, error) {
	var rows []*TargetPositionEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &TargetPositionEntityAwareDeletePreview{Message: "No matching TargetPositionEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []TargetPositionEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d TargetPositionEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &TargetPositionEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// TargetPositionEntityAwareDeleteFn deletes the TargetPositionEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation TargetPositionEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func TargetPositionEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*TargetPositionEntity
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
		return tx.Where("id IN ?", ids).Delete(&TargetPositionEntity{}).Error
	})
}

// TargetPositionEntityActionsSig bundles the actions available for TargetPositionEntity. Extend this (and
// TargetPositionEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type TargetPositionEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *TargetPositionEntity) (*TargetPositionEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input TargetPositionOptionalDto) (*TargetPositionEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*TargetPositionEntity, error)
	Browse             func(tx *gorm.DB, qs TargetPositionBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*TargetPositionEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*TargetPositionEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var TargetPositionEntityActions TargetPositionEntityActionsSig = TargetPositionEntityActionsSig{
	Create:             TargetPositionEntityCreateFn,
	Update:             TargetPositionEntityUpdateFn,
	Get:                TargetPositionEntityGetFn,
	Browse:             TargetPositionEntityBrowseFn,
	AwareDeletePreview: TargetPositionEntityAwareDeletePreviewFn,
	AwareDelete:        TargetPositionEntityAwareDeleteFn,
}
