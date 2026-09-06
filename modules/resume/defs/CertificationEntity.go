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

// The base class definition for certificationEntity
type CertificationEntity struct {
	Id                  int64                  `gorm:"primaryKey;autoIncrement" json:"-" yaml:"-"`
	UniqueId            string                 `gorm:"type:varchar(100);default:gen_random_uuid();unique" json:"uniqueId" yaml:"uniqueId"`
	Resume              *ResumeEntity          `gorm:"foreignKey:ResumeId;references:Id" json:"resume" yaml:"resume"`
	Name                complexes.TString      `json:"name" yaml:"name"`
	IssuingOrganization emigo.Nullable[string] `json:"issuingOrganization" yaml:"issuingOrganization"`
	IssueDate           emigo.Nullable[string] `json:"issueDate" yaml:"issueDate"`
	ExpirationDate      emigo.Nullable[string] `json:"expirationDate" yaml:"expirationDate"`
	CredentialId        emigo.Nullable[string] `json:"credentialId" yaml:"credentialId"`
	CredentialUrl       emigo.Nullable[string] `json:"credentialUrl" yaml:"credentialUrl"`
	ResumeId            int64                  `gorm:"index" json:"-" yaml:"-"`
}

func (x *CertificationEntity) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCertificationEntityCliFlags(prefix string) []emigo.CliFlag {
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
			Name: prefix + "resume",
			Type: "class",
		},
		{
			Name: prefix + "name",
			Type: "complex",
		},
		{
			Name: prefix + "issuing-organization",
			Type: "string?",
		},
		{
			Name: prefix + "issue-date",
			Type: "string?",
		},
		{
			Name: prefix + "expiration-date",
			Type: "string?",
		},
		{
			Name: prefix + "credential-id",
			Type: "string?",
		},
		{
			Name: prefix + "credential-url",
			Type: "string?",
		},
		{
			Name: prefix + "resume-id",
			Type: "int64",
		},
	}
}
func CastCertificationEntityFromCli(c emigo.CliCastable) CertificationEntity {
	data := CertificationEntity{}
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
	if c.IsSet("issuing-organization") {
		emigo.ParseNullable(c.String("issuing-organization"), &data.IssuingOrganization)
	}
	if c.IsSet("issue-date") {
		emigo.ParseNullable(c.String("issue-date"), &data.IssueDate)
	}
	if c.IsSet("expiration-date") {
		emigo.ParseNullable(c.String("expiration-date"), &data.ExpirationDate)
	}
	if c.IsSet("credential-id") {
		emigo.ParseNullable(c.String("credential-id"), &data.CredentialId)
	}
	if c.IsSet("credential-url") {
		emigo.ParseNullable(c.String("credential-url"), &data.CredentialUrl)
	}
	if c.IsSet("resume-id") {
		data.ResumeId = int64(c.Int64("resume-id"))
	}
	return data
}

// Extra entity-specific code (hooks, custom methods, business logic, etc.) can be
// appended here in this template, after the struct GoCommonStructGenerator produced.
// CertificationEntityCreateFn creates a new CertificationEntity row (and its array/collection/one relations,
// including ones nested inside object/object? fields) from dto. dto.Id/dto.UniqueId are
// assigned by the database (see AutoMigrate's column defaults) and populated back onto
// dto once created. Relations are applied in a single transaction: one/one? are
// resolved before the row itself is created (a belongs-to FK doesn't need the parent's
// own id); array/array? and collection/collection? are reconciled afterwards, once
// dto.Id is known.
func CertificationEntityCreateFn(tx *gorm.DB, dto *CertificationEntity) (*CertificationEntity, error) {
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

// CertificationEntityUpdateFn applies a partial update to the CertificationEntity row identified by uniqueId (its
// public identity, e.g. from an API path parameter - never the internal auto-increment
// id). Only fields the caller actually set on input (input.{Field}.IsSet()) are touched -
// anything else is left exactly as it was. one/one? are resolved into their {field}Id
// FK column alongside the rest of the scalar changes; array/array? and
// collection/collection? are reconciled afterwards via the same emigorm helpers
// CertificationEntityCreateFn uses, against entity.Id (the row's real primary key, resolved from
// uniqueId up front - gorm's Association API and the has-many reconcile both join on
// it, not on uniqueId).
func CertificationEntityUpdateFn(tx *gorm.DB, uniqueId string, input CertificationOptionalDto) (*CertificationEntity, error) {
	var entity CertificationEntity
	err := tx.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
			return err
		}
		changes := map[string]interface{}{}
		if input.Resume.IsSet() {
			if input.Resume.Operation != "select" {
				return fmt.Errorf("resume: updating a one/one? relation only supports the \"select\" operation (link to an existing row by its uniqueId), got %q", input.Resume.Operation)
			}
			var selectorId string
			if s, ok := input.Resume.Selector.(string); ok {
				selectorId = s
			}
			resolvedId, err := emigorm.ReconcileOne[ResumeEntity](tx, input.Resume.Operation, selectorId, nil)
			if err != nil {
				return err
			}
			changes["ResumeId"] = resolvedId
		}
		changes["Name"] = input.Name
		if input.IssuingOrganization.IsSet() {
			changes["IssuingOrganization"] = input.IssuingOrganization
		}
		if input.IssueDate.IsSet() {
			changes["IssueDate"] = input.IssueDate
		}
		if input.ExpirationDate.IsSet() {
			changes["ExpirationDate"] = input.ExpirationDate
		}
		if input.CredentialId.IsSet() {
			changes["CredentialId"] = input.CredentialId
		}
		if input.CredentialUrl.IsSet() {
			changes["CredentialUrl"] = input.CredentialUrl
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
	var updated CertificationEntity
	if err := tx.First(&updated, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

// CertificationEntityGetFn looks up a single CertificationEntity row by its public uniqueId (e.g. from an API path
// parameter - never the internal auto-increment id).
func CertificationEntityGetFn(tx *gorm.DB, uniqueId string) (*CertificationEntity, error) {
	var entity CertificationEntity
	if err := tx.First(&entity, "unique_id = ?", uniqueId).Error; err != nil {
		return nil, err
	}
	return &entity, nil
}

// CertificationEntityBrowseFn returns CertificationEntity rows matching qs.Filter (a JSON-logic expression) and
// scope/scopeArgs (a second, handler-enforced condition - e.g. workspace isolation),
// sorted/paged per qs.Sort/StartIndex/ItemsPerPage/Cursor, alongside a
// emigo.QueryResultMeta reporting the total row count matching both filters (ignoring
// paging) and a cursor for fetching the next page.
func CertificationEntityBrowseFn(tx *gorm.DB, qs CertificationBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*CertificationEntity, *emigo.QueryResultMeta, error) {
	filtered, err := emigorm.ApplyQueryFilter(tx.Model(&CertificationEntity{}), qs.Filter)
	if err != nil {
		return nil, nil, err
	}
	filtered = emigorm.ApplyQueryScope(filtered, scope, scopeArgs...)
	var total int64
	if err := filtered.Count(&total).Error; err != nil {
		return nil, nil, err
	}
	var items []*CertificationEntity
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

// CertificationEntityAwareDeleteAffected reports one relation of CertificationEntity that would be affected by
// deleting the matching row(s) - either its has-many child rows are hard-deleted
// (array/array?) or its many-to-many join rows are cleared, leaving the target rows
// themselves untouched (collection/collection?). one/one? relations are never listed:
// they're a plain FK column on CertificationEntity itself, so deleting CertificationEntity doesn't cascade into them.
type CertificationEntityAwareDeleteAffected struct {
	Relation string `json:"relation"`
	Count    int64  `json:"count"`
}

// CertificationEntityAwareDeletePreview is the result of CertificationEntityAwareDeletePreviewFn: a human-readable
// summary plus the exact per-relation counts CertificationEntityAwareDeleteFn would delete/clear
// alongside the CertificationEntity row(s) themselves.
type CertificationEntityAwareDeletePreview struct {
	Message  string                                   `json:"message"`
	Affected []CertificationEntityAwareDeleteAffected `json:"affected"`
}

// CertificationEntityAwareDeletePreviewFn looks up the CertificationEntity rows matching uniqueIds and reports what
// deleting them would affect - every array/array?/collection/collection? relation (at
// any nesting depth inside object/object? containers), matching exactly what
// CertificationEntityAwareDeleteFn deletes/clears. Intended as a confirmation step before actually
// calling CertificationEntityAwareDeleteFn.
func CertificationEntityAwareDeletePreviewFn(tx *gorm.DB, uniqueIds []string) (*CertificationEntityAwareDeletePreview, error) {
	var rows []*CertificationEntity
	if err := tx.Where("unique_id IN ?", uniqueIds).Find(&rows).Error; err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return &CertificationEntityAwareDeletePreview{Message: "No matching CertificationEntity row was found for the given uniqueIds."}, nil
	}
	ids := make([]int64, len(rows))
	for i := range rows {
		ids[i] = rows[i].Id
	}
	affected := []CertificationEntityAwareDeleteAffected{}
	var total int64
	message := fmt.Sprintf("Deleting %d CertificationEntity row(s) will affect %d related record(s) across %d relation(s).", len(rows), total, len(affected))
	return &CertificationEntityAwareDeletePreview{Message: message, Affected: affected}, nil
}

// CertificationEntityAwareDeleteFn deletes the CertificationEntity rows matching uniqueIds, along with every
// array/array?/collection/collection? relation CertificationEntityAwareDeletePreviewFn reports (see
// its own doc comment for exactly what that means per relation kind).
func CertificationEntityAwareDeleteFn(tx *gorm.DB, uniqueIds []string) error {
	return tx.Transaction(func(tx *gorm.DB) error {
		var rows []*CertificationEntity
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
		return tx.Where("id IN ?", ids).Delete(&CertificationEntity{}).Error
	})
}

// CertificationEntityActionsSig bundles the actions available for CertificationEntity. Extend this (and
// CertificationEntityActions below) with more fields as more actions are generated. Which fields are
// present here depends on entity.Features (see Module3EntityFeatures) - a disabled
// feature is omitted entirely rather than left as a nil func.
type CertificationEntityActionsSig struct {
	Create             func(tx *gorm.DB, dto *CertificationEntity) (*CertificationEntity, error)
	Update             func(tx *gorm.DB, uniqueId string, input CertificationOptionalDto) (*CertificationEntity, error)
	Get                func(tx *gorm.DB, uniqueId string) (*CertificationEntity, error)
	Browse             func(tx *gorm.DB, qs CertificationBrowseActionQuery, scope string, scopeArgs ...interface{}) ([]*CertificationEntity, *emigo.QueryResultMeta, error)
	AwareDeletePreview func(tx *gorm.DB, uniqueIds []string) (*CertificationEntityAwareDeletePreview, error)
	AwareDelete        func(tx *gorm.DB, uniqueIds []string) error
}

var CertificationEntityActions CertificationEntityActionsSig = CertificationEntityActionsSig{
	Create:             CertificationEntityCreateFn,
	Update:             CertificationEntityUpdateFn,
	Get:                CertificationEntityGetFn,
	Browse:             CertificationEntityBrowseFn,
	AwareDeletePreview: CertificationEntityAwareDeletePreviewFn,
	AwareDelete:        CertificationEntityAwareDeleteFn,
}
