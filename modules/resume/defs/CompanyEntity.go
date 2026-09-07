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

// The base class definition for companyEntity
type CompanyEntity struct {
	Id          int64                  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId    string                 `gorm:"type:varchar(100);unique" json:"uniqueId" yaml:"uniqueId"`
	Name        string                 `json:"name" yaml:"name"`
	Industry    complexes.TString      `json:"industry" yaml:"industry"`
	Website     emigo.Nullable[string] `json:"website" yaml:"website"`
	LogoUrl     emigo.Nullable[string] `json:"logoUrl" yaml:"logoUrl"`
	Location    complexes.TString      `json:"location" yaml:"location"`
	Description complexes.TString      `json:"description" yaml:"description"`
}

func (x *CompanyEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCompanyEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "industry",
			Type: "complex",
		},
		{
			Name: prefix + "website",
			Type: "string?",
		},
		{
			Name: prefix + "logo-url",
			Type: "string?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name: prefix + "description",
			Type: "complex",
		},
	}
}
func CastCompanyEntityFromCli(c emigo.CliCastable) CompanyEntity {
	data := CompanyEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("name") {
		data.Name = c.String("name")
	}
	if c.IsSet("industry") {
		if u, ok := any(&data.Industry).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("industry")))
		}
	}
	if c.IsSet("website") {
		emigo.ParseNullable(c.String("website"), &data.Website)
	}
	if c.IsSet("logo-url") {
		emigo.ParseNullable(c.String("logo-url"), &data.LogoUrl)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
		}
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
// BeforeCreate assigns UniqueId a random UUID (v4) if the caller hasn't already set one -
// gorm calls this automatically from every Create()/Save() insert path (including the
// has-many/many-to-many reconcile helpers in emigorm, which persist child rows via
// tx.Save() directly rather than through a generated *CreateFn). This replaces relying
// on a DB-level column default (e.g. Postgres's gen_random_uuid()): sqlite and MySQL
// have no dialect-portable equivalent, so assigning it here instead works identically
// across every gorm dialect, with no SQL default expression at all.
func (x *CompanyEntity) BeforeCreate(tx *gorm.DB) error {
	if x.UniqueId == "" {
		x.UniqueId = emigo.NewUUIDv4()
	}
	return nil
}

// CompanyEntityCreateFn creates a new CompanyEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func CompanyEntityCreateFn(tx *gorm.DB, dto *CompanyEntity) (*CompanyEntity, error) {
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

// CompanyEntityUpdateFn applies a partial update to the CompanyEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// CompanyEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func CompanyEntityUpdateFn(tx *gorm.DB, uniqueId string, input CompanyOptionalDto) (*CompanyEntity, error) {
	var entity CompanyEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Name.IsSet() {
			changes["Name"] = input.Name
		}
		changes["Industry"] = input.Industry
		if input.Website.IsSet() {
			changes["Website"] = input.Website
		}
		if input.LogoUrl.IsSet() {
			changes["LogoUrl"] = input.LogoUrl
		}
		changes["Location"] = input.Location
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
	var updated CompanyEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// CompanyEntityGetFn looks up a single CompanyEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func CompanyEntityGetFn(tx *gorm.DB, uniqueId string) (*CompanyEntity, error) {
	var entity CompanyEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// CompanyEntityBrowseFn returns CompanyEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func CompanyEntityBrowseFn(tx *gorm.DB, qs CompanyBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*CompanyEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&CompanyEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*CompanyEntity
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

// CompanyEntityAwareDeleteAffected reports one relation of CompanyEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on CompanyEntity itself, so deleting CompanyEntity doesn't cascade into them.
type CompanyEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// CompanyEntityAwareDeletePreview is the result of CompanyEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts CompanyEntityAwareDeleteFn would delete/clear
// alongside the CompanyEntity row(s) themselves.
type CompanyEntityAwareDeletePreview struct {
	Message  string                             `json:"message"`
	Affected []CompanyEntityAwareDeleteAffected `json:"affected"`
}

// CompanyEntityAwareDeletePreviewFn looks up the CompanyEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// CompanyEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling CompanyEntityAwareDeleteFn.
func CompanyEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*CompanyEntityAwareDeletePreview, error) {
	var rows []*CompanyEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &CompanyEntityAwareDeletePreview{Message: "No matching CompanyEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []CompanyEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d CompanyEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &CompanyEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// CompanyEntityAwareDeleteFn deletes the CompanyEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation CompanyEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func CompanyEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*CompanyEntity
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
		return tx.Where("id IN ?", ids).Delete(&CompanyEntity{}).Error
	})
}

// CompanyEntityActionsSig bundles the actions available for CompanyEntity. Extend this (and
// CompanyEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type CompanyEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *CompanyEntity) (*CompanyEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input CompanyOptionalDto) (*CompanyEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*CompanyEntity, error)
	Browse             func(tx *gorm.DB, qs CompanyBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*CompanyEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*CompanyEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var CompanyEntityActions CompanyEntityActionsSig = CompanyEntityActionsSig{
	Create:             CompanyEntityCreateFn,
	Update:             CompanyEntityUpdateFn,
	Get:                CompanyEntityGetFn,
	Browse:             CompanyEntityBrowseFn,
	AwareDeletePreview: CompanyEntityAwareDeletePreviewFn,
	AwareDelete:        CompanyEntityAwareDeleteFn,
}
