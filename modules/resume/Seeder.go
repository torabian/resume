package resume

// ResumeDataSeeder is the seed/import shape for a full resume - see
// resume-data.yml at the repo root for a filled-in example. It's a
// dedicated set of structs rather than the generated resumedefs.*Entity
// types themselves for two reasons: it needs to express cross-entity
// references (workExperiences[].company) as plain string keys instead of
// numeric database ids, and Resume/Company/the section entities are
// related 1-to-many here, not the flat list of independent rows
// fireback.SeederFromFSImport (see
// ../nima/modules/musicalwork/InstrumentSeeders.go) expects.
import (
	"encoding/json"
	"errors"
	"fmt"
	"os"

	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
	resumedefs "github.com/torabian/resume/modules/resume/defs"
	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

type ResumeDataSeeder struct {
	Resume          ResumeSeederProfile           `yaml:"resume"`
	Companies       []ResumeSeederCompany         `yaml:"companies"`
	TargetPositions []ResumeSeederTargetPosition  `yaml:"targetPositions"`
	WorkExperiences []ResumeSeederWorkExperience  `yaml:"workExperiences"`
	Educations      []ResumeSeederEducation       `yaml:"educations"`
	Skills          []ResumeSeederSkill           `yaml:"skills"`
	Projects        []ResumeSeederProject         `yaml:"projects"`
	Certifications  []ResumeSeederCertification   `yaml:"certifications"`
	Languages       []ResumeSeederLanguage        `yaml:"languages"`
	// Content picks which skills/projects (by their own `key`, below) go
	// into resume.content - the same {kind, uniqueId, label} JSON array the
	// Resume Creator screen's drag-and-drop picker writes (see
	// Resume.emi.yml's own doc comment on the `content` field). A plain
	// list of keys here, resolved against skillsByKey/projectsByKey once
	// every skill/project row has been created - see SeedResumeData's own
	// build-the-content-array step at the end.
	Content []string `yaml:"content"`
}

type ResumeSeederTargetPosition struct {
	Name complexes.TString `yaml:"name"`
}

// Fields typed complexes.TString below mirror Resume.emi.yml's own
// translatable-field split (see its top-of-file note): TString unmarshals
// from either a bare string ("Software Engineer", the common single-locale
// case - becomes {"en": "Software Engineer"}) or a real {locale: value} map
// ({en: ..., fa: ...}) transparently (see complexes.TString's own doc
// comment), so existing single-language seeder content in resume-data.yml
// needs no changes - only entries that actually want a Persian (or other)
// translation need to switch to the map form.
type ResumeSeederProfile struct {
	FullName  string            `yaml:"fullName"`
	Headline  complexes.TString `yaml:"headline"`
	Summary   complexes.TString `yaml:"summary"`
	Email     string            `yaml:"email"`
	Phone     string            `yaml:"phone"`
	Location  complexes.TString `yaml:"location"`
	Website   string            `yaml:"website"`
	Linkedin  string            `yaml:"linkedin"`
	Github    string            `yaml:"github"`
	PhotoUrl  string            `yaml:"photoUrl"`
	Language  string            `yaml:"language"`
	IsPrimary bool              `yaml:"isPrimary"`
}

// Key is a seeder-only field (not part of CompanyEntity) - it's how
// workExperiences[].company below points at one of these without needing a
// real database id yet.
type ResumeSeederCompany struct {
	Key         string            `yaml:"key"`
	Name        string            `yaml:"name"`
	Industry    complexes.TString `yaml:"industry"`
	Website     string            `yaml:"website"`
	LogoUrl     string            `yaml:"logoUrl"`
	Location    complexes.TString `yaml:"location"`
	Description complexes.TString `yaml:"description"`
}

// Company references a ResumeSeederCompany.Key; left empty when the role
// has no associated company.
//
// Remote is parsed from the seeder yaml but no longer applied: Resume.emi.yml
// dropped workExperience.remote (see its own diff), so
// resumedefs.WorkExperienceEntity has no matching field to copy it into
// below anymore - any `remote:` key in resume-data.yml is now silently
// ignored.
type ResumeSeederWorkExperience struct {
	Company        string            `yaml:"company"`
	JobTitle       complexes.TString `yaml:"jobTitle"`
	EmploymentType string            `yaml:"employmentType"`
	Location       complexes.TString `yaml:"location"`
	Remote         bool              `yaml:"remote"`
	StartDate      string            `yaml:"startDate"`
	EndDate        string            `yaml:"endDate"`
	IsCurrent      bool              `yaml:"isCurrent"`
	Summary        complexes.TString `yaml:"summary"`
	Achievements   []string          `yaml:"achievements"`
}

type ResumeSeederEducation struct {
	Institution  string            `yaml:"institution"`
	Degree       complexes.TString `yaml:"degree"`
	FieldOfStudy complexes.TString `yaml:"fieldOfStudy"`
	Location     complexes.TString `yaml:"location"`
	StartDate    string            `yaml:"startDate"`
	EndDate      string            `yaml:"endDate"`
	IsCurrent    bool              `yaml:"isCurrent"`
	Grade        string            `yaml:"grade"`
	Description  complexes.TString `yaml:"description"`
}

type ResumeSeederSkill struct {
	// Key is a seeder-only field (like ResumeSeederCompany.Key) - how
	// `content` (above) references this skill without needing a real
	// database id yet. Left empty for a skill that's just recorded, not
	// picked for this resume's content.
	Key               string            `yaml:"key"`
	Name              string            `yaml:"name"`
	Category          string            `yaml:"category"`
	Level             string            `yaml:"level"`
	YearsOfExperience int               `yaml:"yearsOfExperience"`
	Description       complexes.TString `yaml:"description"`
}

// IsOngoing/Technologies/Highlights are parsed from the seeder yaml but no
// longer applied: Resume.emi.yml dropped all three from the `project`
// entity in favor of the new experience/descriptions relation fields (see
// ResumeActions.go's projectDtoFromEntity doc comment), so
// resumedefs.ProjectEntity has no matching fields to copy them into below
// anymore - any `isOngoing:`/`technologies:`/`highlights:` keys in
// resume-data.yml are now silently ignored.
type ResumeSeederProject struct {
	// Key - see ResumeSeederSkill.Key's own doc comment; same idea, same
	// `content` list.
	Key          string            `yaml:"key"`
	Name         string            `yaml:"name"`
	Role         complexes.TString `yaml:"role"`
	Summary      complexes.TString `yaml:"summary"`
	StartDate    string            `yaml:"startDate"`
	EndDate      string            `yaml:"endDate"`
	IsOngoing    bool              `yaml:"isOngoing"`
	Url          string            `yaml:"url"`
	RepoUrl      string            `yaml:"repoUrl"`
	Technologies []string          `yaml:"technologies"`
	Highlights   []string          `yaml:"highlights"`
}

type ResumeSeederCertification struct {
	Name                complexes.TString `yaml:"name"`
	IssuingOrganization string            `yaml:"issuingOrganization"`
	IssueDate           string            `yaml:"issueDate"`
	ExpirationDate      string            `yaml:"expirationDate"`
	CredentialId        string            `yaml:"credentialId"`
	CredentialUrl       string            `yaml:"credentialUrl"`
}

type ResumeSeederLanguage struct {
	Name        complexes.TString `yaml:"name"`
	Proficiency string            `yaml:"proficiency"`
}

// LoadResumeDataSeederFile reads a seeder yaml file off disk - resume-data.yml
// at the repo root, matching this file's shape, is a real example.
func LoadResumeDataSeederFile(path string) (*ResumeDataSeeder, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading resume data seeder %q: %w", path, err)
	}
	var seeder ResumeDataSeeder
	if err := yaml.Unmarshal(raw, &seeder); err != nil {
		return nil, fmt.Errorf("parsing resume data seeder %q: %w", path, err)
	}
	return &seeder, nil
}

// SeedResumeData injects a ResumeDataSeeder into the database: it creates
// the Resume row, every Company, then every section entity linked back to
// them (workExperiences[].company resolved from the seeder's own string
// keys to the just-created Company row's id). Every write happens inside
// one transaction.
//
// Matching the delete-then-recreate convention every other *SyncSeeders in
// this codebase uses (see e.g.
// ../nima/modules/musicalwork/InstrumentSeeders.go's syncInstrument), any
// existing resume with the same FullName - and its own sections - is
// deleted first, so this function is safe to re-run (e.g. from a CLI
// command backed by resume-data.yml) whenever the seeder content changes.
func SeedResumeData(db *gorm.DB, seeder *ResumeDataSeeder) (*resumedefs.ResumeEntity, error) {
	if seeder == nil {
		return nil, fmt.Errorf("seed resume data: seeder is nil")
	}

	var resume *resumedefs.ResumeEntity

	err := db.Transaction(func(tx *gorm.DB) error {
		if err := deleteExistingResume(tx, seeder.Resume.FullName); err != nil {
			return fmt.Errorf("clearing existing resume %q: %w", seeder.Resume.FullName, err)
		}

		// Skills and Projects are created up front, before the Resume row
		// itself, specifically so `resume.content` (below) can be set
		// directly in the initial Create call instead of a follow-up
		// Update. A follow-up Update would be a real bug, not just an
		// ordering nicety: Headline/Summary/Location/Content are all plain
		// `complex` fields (TString/MJson) with no IsSet() concept, so the
		// generated Update always applies every one of them unconditionally
		// (see EducationEntityUpdateFn and friends) - an
		// Update(ResumeOptionalDto{Content: ...}) call with every other
		// field left at its Go zero value would silently wipe
		// Headline/Summary/Location right back to empty the moment it ran.
		// This is the exact same bug class ResumeCreator's own TString
		// fields hit before CommonEntityManager was fixed to seed
		// touchedData with the full record - creating Content alongside
		// everything else in one Create call sidesteps it entirely rather
		// than needing to remember to carry every other complex field
		// forward on some later partial Update.
		skillsByKey := make(map[string]*resumedefs.SkillEntity, len(seeder.Skills))
		for _, s := range seeder.Skills {
			entity := &resumedefs.SkillEntity{

				Name:              s.Name,
				Category:          emigo.NullableOf(s.Category),
				Level:             emigo.NullableOf(s.Level),
				YearsOfExperience: emigo.NullableOf(s.YearsOfExperience),
				Description:       s.Description,
			}
			created, err := resumedefs.SkillEntityActions.Create(tx, entity)
			if err != nil {
				return fmt.Errorf("creating skill %q: %w", s.Name, err)
			}
			if s.Key != "" {
				skillsByKey[s.Key] = created
			}
		}

		projectsByKey := make(map[string]*resumedefs.ProjectEntity, len(seeder.Projects))
		for _, p := range seeder.Projects {
			entity := &resumedefs.ProjectEntity{

				Name:      p.Name,
				Role:      p.Role,
				Summary:   p.Summary,
				StartDate: complexes.XDate(p.StartDate),
				EndDate:   complexes.XDate(p.EndDate),
				Url:       emigo.NullableOf(p.Url),
				RepoUrl:   emigo.NullableOf(p.RepoUrl),
			}
			created, err := resumedefs.ProjectEntityActions.Create(tx, entity)
			if err != nil {
				return fmt.Errorf("creating project %q: %w", p.Name, err)
			}
			if p.Key != "" {
				projectsByKey[p.Key] = created
			}
		}

		// See ResumeSeederSkill.Key/ResumeSeederProject.Key's own doc
		// comments - `content` picks which of the skills/projects just
		// created above (by that same seeder-only key) go into
		// resume.content, resolved into the {kind, uniqueId, label} shape
		// the Resume Creator screen's picker itself writes
		// (resumeContentItem - see ResumeToLatexImplementation.go).
		var resumeContent complexes.MJson
		if len(seeder.Content) > 0 {
			items := make([]resumeContentItem, 0, len(seeder.Content))
			for _, key := range seeder.Content {
				if s, ok := skillsByKey[key]; ok {
					items = append(items, resumeContentItem{Kind: "skill", UniqueId: s.UniqueId, Label: s.Name})
					continue
				}
				if p, ok := projectsByKey[key]; ok {
					items = append(items, resumeContentItem{Kind: "project", UniqueId: p.UniqueId, Label: p.Name})
					continue
				}
				return fmt.Errorf("resume.content references unknown skill/project key %q", key)
			}
			encoded, err := json.Marshal(items)
			if err != nil {
				return fmt.Errorf("encoding resume content: %w", err)
			}
			resumeContent = complexes.MJson(encoded)
		}

		created, err := resumedefs.ResumeEntityActions.Create(tx, &resumedefs.ResumeEntity{
			FullName:  seeder.Resume.FullName,
			Headline:  seeder.Resume.Headline,
			Summary:   seeder.Resume.Summary,
			Email:     emigo.NullableOf(seeder.Resume.Email),
			Phone:     emigo.NullableOf(seeder.Resume.Phone),
			Location:  seeder.Resume.Location,
			Website:   emigo.NullableOf(seeder.Resume.Website),
			Linkedin:  emigo.NullableOf(seeder.Resume.Linkedin),
			Github:    emigo.NullableOf(seeder.Resume.Github),
			PhotoUrl:  emigo.NullableOf(seeder.Resume.PhotoUrl),
			Language:  emigo.NullableOf(seeder.Resume.Language),
			IsPrimary: emigo.NullableOf(seeder.Resume.IsPrimary),
			Content:   resumeContent,
		})
		if err != nil {
			return fmt.Errorf("creating resume: %w", err)
		}
		resume = created

		for _, t := range seeder.TargetPositions {
			if _, err := resumedefs.TargetPositionEntityActions.Create(tx, &resumedefs.TargetPositionEntity{
				Name: t.Name,
			}); err != nil {
				return fmt.Errorf("creating target position %q: %w", t.Name.Get("en"), err)
			}
		}

		companies := make(map[string]*resumedefs.CompanyEntity, len(seeder.Companies))
		for _, c := range seeder.Companies {
			createdCompany, err := resumedefs.CompanyEntityActions.Create(tx, &resumedefs.CompanyEntity{
				Name:        c.Name,
				Industry:    c.Industry,
				Website:     emigo.NullableOf(c.Website),
				LogoUrl:     emigo.NullableOf(c.LogoUrl),
				Location:    c.Location,
				Description: c.Description,
			})
			if err != nil {
				return fmt.Errorf("creating company %q: %w", c.Name, err)
			}
			if c.Key != "" {
				companies[c.Key] = createdCompany
			}
		}

		for _, w := range seeder.WorkExperiences {
			entity := &resumedefs.WorkExperienceEntity{
				JobTitle:       w.JobTitle,
				EmploymentType: emigo.NullableOf(w.EmploymentType),
				Location:       w.Location,
				StartDate:      complexes.XDate(w.StartDate),
				EndDate:        complexes.XDate(w.EndDate),
				Achievements:   emigo.NullableOf(w.Achievements),
			}
			// `company` is a plain TString field now, not a relation (see
			// Resume.emi.yml) - still resolved through the same companies
			// map keyed by seeder.Companies[].Key, but the looked-up
			// company's Name is copied in as a value rather than linked by
			// CompanyId. Note this also means the created row is no longer
			// scoped to `resume` at all (WorkExperience dropped its
			// `resume: one` field too) - it's created standalone.
			if w.Company != "" {
				company, ok := companies[w.Company]
				if !ok {
					return fmt.Errorf("work experience %q references unknown company key %q", w.JobTitle, w.Company)
				}
				entity.Company = complexes.NewTString(company.Name)
			}
			if _, err := resumedefs.WorkExperienceEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating work experience %q: %w", w.JobTitle, err)
			}
		}

		for _, e := range seeder.Educations {
			entity := &resumedefs.EducationEntity{

				Institution:  e.Institution,
				Degree:       e.Degree,
				FieldOfStudy: e.FieldOfStudy,
				Location:     e.Location,
				StartDate:    complexes.XDate(e.StartDate),
				EndDate:      complexes.XDate(e.EndDate),
				IsCurrent:    emigo.NullableOf(e.IsCurrent),
				Grade:        emigo.NullableOf(e.Grade),
				Description:  e.Description,
			}
			if _, err := resumedefs.EducationEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating education %q: %w", e.Institution, err)
			}
		}

		for _, c := range seeder.Certifications {
			entity := &resumedefs.CertificationEntity{

				Name:                c.Name,
				IssuingOrganization: emigo.NullableOf(c.IssuingOrganization),
				IssueDate:           emigo.NullableOf(c.IssueDate),
				ExpirationDate:      emigo.NullableOf(c.ExpirationDate),
				CredentialId:        emigo.NullableOf(c.CredentialId),
				CredentialUrl:       emigo.NullableOf(c.CredentialUrl),
			}
			if _, err := resumedefs.CertificationEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating certification %q: %w", c.Name, err)
			}
		}

		for _, l := range seeder.Languages {
			entity := &resumedefs.LanguageEntity{

				Name:        l.Name,
				Proficiency: emigo.NullableOf(l.Proficiency),
			}
			if _, err := resumedefs.LanguageEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating language %q: %w", l.Name, err)
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return resume, nil
}

// deleteExistingResume removes a previously-seeded resume (matched by
// fullName) so SeedResumeData can be called repeatedly without piling up
// duplicate Resume rows.
//
// Only the Resume row itself, though - WorkExperience/Education/Skill/
// Project/Certification/Language (and TargetPosition) aren't scoped to a
// resume at all anymore (see Resume.emi.yml's own top-of-file note: every
// section entity dropped its `resume: one` field), so there's no "this
// resume's own sections" to clean up here the way an earlier version of
// this function tried to (deleting by a `resume_id` column that's still
// physically in the table from before that change, but nothing here ever
// writes to it, so that delete-by-resume_id silently matched zero rows on
// every entity created since - not a crash, just dead code). Re-running
// `resume seed` therefore recreates a fresh set of companies/skills/
// projects/etc. every time rather than reconciling with what's already
// there - fine for this repo's own personal-single-resume use, but worth
// knowing before seeding into a database anyone else's data also lives in.
func deleteExistingResume(tx *gorm.DB, fullName string) error {
	if fullName == "" {
		return nil
	}

	var existing resumedefs.ResumeEntity
	err := tx.Where("full_name = ?", fullName).First(&existing).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	return tx.Delete(&existing).Error
}
