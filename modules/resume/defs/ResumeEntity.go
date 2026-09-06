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

// The base class definition for resumeEntity
type ResumeEntity struct {
	Id       int64  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId string `gorm:"type:varchar(100);default:gen_random_uuid();unique" json:"uniqueId" yaml:"uniqueId"`
	FullName string `json:"fullName" yaml:"fullName"`
	// Short title under the name, e.g. "Senior Backend Engineer"
	Headline complexes.TString `json:"headline" yaml:"headline"`
	// Longer professional summary / objective paragraph.
	Summary  complexes.TString      `json:"summary" yaml:"summary"`
	Email    emigo.Nullable[string] `json:"email" yaml:"email"`
	Phone    emigo.Nullable[string] `json:"phone" yaml:"phone"`
	Location complexes.TString      `json:"location" yaml:"location"`
	Website  emigo.Nullable[string] `json:"website" yaml:"website"`
	Linkedin emigo.Nullable[string] `json:"linkedin" yaml:"linkedin"`
	Github   emigo.Nullable[string] `json:"github" yaml:"github"`
	PhotoUrl emigo.Nullable[string] `json:"photoUrl" yaml:"photoUrl"`
	// Language the resume content itself is written in, e.g. "en".
	Language emigo.Nullable[string] `json:"language" yaml:"language"`
	// Marks the default resume when a user keeps several variants.
	IsPrimary emigo.Nullable[bool] `json:"isPrimary" yaml:"isPrimary"`
	// Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.
	Content complexes.MJson `json:"content" yaml:"content"`
}

func (x *ResumeEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetResumeEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "full-name",
			Type: "string",
		},
		{
			Name:        prefix + "headline",
			Type:        "complex",
			Description: "Short title under the name, e.g. \"Senior Backend Engineer\"",
		},
		{
			Name:        prefix + "summary",
			Type:        "complex",
			Description: "Longer professional summary / objective paragraph.",
		},
		{
			Name: prefix + "email",
			Type: "string?",
		},
		{
			Name: prefix + "phone",
			Type: "string?",
		},
		{
			Name: prefix + "location",
			Type: "complex",
		},
		{
			Name: prefix + "website",
			Type: "string?",
		},
		{
			Name: prefix + "linkedin",
			Type: "string?",
		},
		{
			Name: prefix + "github",
			Type: "string?",
		},
		{
			Name: prefix + "photo-url",
			Type: "string?",
		},
		{
			Name:        prefix + "language",
			Type:        "string?",
			Description: "Language the resume content itself is written in, e.g. \"en\".",
		},
		{
			Name:        prefix + "is-primary",
			Type:        "bool?",
			Description: "Marks the default resume when a user keeps several variants.",
		},
		{
			Name:        prefix + "content",
			Type:        "complex",
			Description: "Skills/projects picked for this resume via the Resume Creator screen (ui/src/modules/resume/ResumeCreator.tsx) - a JSON array of {kind, uniqueId, label} objects, in the order chosen there. Not modeled as real one/collection relations to Skill/Project (those entities dropped their own `resume: one` link - see this file's own top-of-file note on why): this is a lightweight snapshot the picker UI reads/writes wholesale, not a queryable relation.",
		},
	}
}
func CastResumeEntityFromCli(c emigo.CliCastable) ResumeEntity {
	data := ResumeEntity{}
	if c.IsSet("id") {
		data.Id = int64(c.Int64("id"))
	}
	if c.IsSet("unique-id") {
		data.UniqueId = c.String("unique-id")
	}
	if c.IsSet("full-name") {
		data.FullName = c.String("full-name")
	}
	if c.IsSet("headline") {
		if u, ok := any(&data.Headline).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("headline")))
		}
	}
	if c.IsSet("summary") {
		if u, ok := any(&data.Summary).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("summary")))
		}
	}
	if c.IsSet("email") {
		emigo.ParseNullable(c.String("email"), &data.Email)
	}
	if c.IsSet("phone") {
		emigo.ParseNullable(c.String("phone"), &data.Phone)
	}
	if c.IsSet("location") {
		if u, ok := any(&data.Location).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("location")))
		}
	}
	if c.IsSet("website") {
		emigo.ParseNullable(c.String("website"), &data.Website)
	}
	if c.IsSet("linkedin") {
		emigo.ParseNullable(c.String("linkedin"), &data.Linkedin)
	}
	if c.IsSet("github") {
		emigo.ParseNullable(c.String("github"), &data.Github)
	}
	if c.IsSet("photo-url") {
		emigo.ParseNullable(c.String("photo-url"), &data.PhotoUrl)
	}
	if c.IsSet("language") {
		emigo.ParseNullable(c.String("language"), &data.Language)
	}
	if c.IsSet("is-primary") {
		emigo.ParseNullable(c.String("is-primary"), &data.IsPrimary)
	}
	if c.IsSet("content") {
		if u, ok := any(&data.Content).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("content")))
		}
	}
	return data
}

// Extra entity-specific code (hooks, custom methods, business logic, etc.) can be
// appended here in this template, after the struct GoCommonStructGenerator produced.
// ResumeEntityCreateFn creates a new ResumeEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func ResumeEntityCreateFn(tx *gorm.DB, dto *ResumeEntity) (*ResumeEntity, error) {
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

// ResumeEntityUpdateFn applies a partial update to the ResumeEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// ResumeEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func ResumeEntityUpdateFn(tx *gorm.DB, uniqueId string, input ResumeOptionalDto) (*ResumeEntity, error) {
	var entity ResumeEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.FullName.IsSet() {
			changes["FullName"] = input.FullName
		}
		changes["Headline"] = input.Headline
		changes["Summary"] = input.Summary
		if input.Email.IsSet() {
			changes["Email"] = input.Email
		}
		if input.Phone.IsSet() {
			changes["Phone"] = input.Phone
		}
		changes["Location"] = input.Location
		if input.Website.IsSet() {
			changes["Website"] = input.Website
		}
		if input.Linkedin.IsSet() {
			changes["Linkedin"] = input.Linkedin
		}
		if input.Github.IsSet() {
			changes["Github"] = input.Github
		}
		if input.PhotoUrl.IsSet() {
			changes["PhotoUrl"] = input.PhotoUrl
		}
		if input.Language.IsSet() {
			changes["Language"] = input.Language
		}
		if input.IsPrimary.IsSet() {
			changes["IsPrimary"] = input.IsPrimary
		}
		changes["Content"] = input.Content
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
	var updated ResumeEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// ResumeEntityGetFn looks up a single ResumeEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func ResumeEntityGetFn(tx *gorm.DB, uniqueId string) (*ResumeEntity, error) {
	var entity ResumeEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// ResumeEntityBrowseFn returns ResumeEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func ResumeEntityBrowseFn(tx *gorm.DB, qs ResumeBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*ResumeEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&ResumeEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*ResumeEntity
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

// ResumeEntityAwareDeleteAffected reports one relation of ResumeEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on ResumeEntity itself, so deleting ResumeEntity doesn't cascade into them.
type ResumeEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// ResumeEntityAwareDeletePreview is the result of ResumeEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts ResumeEntityAwareDeleteFn would delete/clear
// alongside the ResumeEntity row(s) themselves.
type ResumeEntityAwareDeletePreview struct {
	Message  string                            `json:"message"`
	Affected []ResumeEntityAwareDeleteAffected `json:"affected"`
}

// ResumeEntityAwareDeletePreviewFn looks up the ResumeEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// ResumeEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling ResumeEntityAwareDeleteFn.
func ResumeEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*ResumeEntityAwareDeletePreview, error) {
	var rows []*ResumeEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &ResumeEntityAwareDeletePreview{Message: "No matching ResumeEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []ResumeEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d ResumeEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &ResumeEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// ResumeEntityAwareDeleteFn deletes the ResumeEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation ResumeEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func ResumeEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*ResumeEntity
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
		return tx.Where("id IN ?", ids).Delete(&ResumeEntity{}).Error
	})
}

// ResumeEntityActionsSig bundles the actions available for ResumeEntity. Extend this (and
// ResumeEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type ResumeEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *ResumeEntity) (*ResumeEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input ResumeOptionalDto) (*ResumeEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*ResumeEntity, error)
	Browse             func(tx *gorm.DB, qs ResumeBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*ResumeEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*ResumeEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var ResumeEntityActions ResumeEntityActionsSig = ResumeEntityActionsSig{
	Create:             ResumeEntityCreateFn,
	Update:             ResumeEntityUpdateFn,
	Get:                ResumeEntityGetFn,
	Browse:             ResumeEntityBrowseFn,
	AwareDeletePreview: ResumeEntityAwareDeletePreviewFn,
	AwareDelete:        ResumeEntityAwareDeleteFn,
}
