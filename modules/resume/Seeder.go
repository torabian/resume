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
	Resume          ResumeSeederProfile          `yaml:"resume"`
	Companies       []ResumeSeederCompany        `yaml:"companies"`
	WorkExperiences []ResumeSeederWorkExperience `yaml:"workExperiences"`
	Educations      []ResumeSeederEducation      `yaml:"educations"`
	Skills          []ResumeSeederSkill          `yaml:"skills"`
	Projects        []ResumeSeederProject        `yaml:"projects"`
	Certifications  []ResumeSeederCertification  `yaml:"certifications"`
	Languages       []ResumeSeederLanguage       `yaml:"languages"`
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
	Name              string            `yaml:"name"`
	Category          string            `yaml:"category"`
	Level             string            `yaml:"level"`
	YearsOfExperience int               `yaml:"yearsOfExperience"`
	Description       complexes.TString `yaml:"description"`
}

type ResumeSeederProject struct {
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
		})
		if err != nil {
			return fmt.Errorf("creating resume: %w", err)
		}
		resume = created

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
				Remote:         emigo.NullableOf(w.Remote),
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

		for _, s := range seeder.Skills {
			entity := &resumedefs.SkillEntity{

				Name:              s.Name,
				Category:          emigo.NullableOf(s.Category),
				Level:             emigo.NullableOf(s.Level),
				YearsOfExperience: emigo.NullableOf(s.YearsOfExperience),
				Description:       s.Description,
			}
			if _, err := resumedefs.SkillEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating skill %q: %w", s.Name, err)
			}
		}

		for _, p := range seeder.Projects {
			entity := &resumedefs.ProjectEntity{

				Name:         p.Name,
				Role:         p.Role,
				Summary:      p.Summary,
				StartDate:    complexes.XDate(p.StartDate),
				EndDate:      complexes.XDate(p.EndDate),
				IsOngoing:    emigo.NullableOf(p.IsOngoing),
				Url:          emigo.NullableOf(p.Url),
				RepoUrl:      emigo.NullableOf(p.RepoUrl),
				Technologies: emigo.NullableOf(p.Technologies),
				Highlights:   emigo.NullableOf(p.Highlights),
			}
			if _, err := resumedefs.ProjectEntityActions.Create(tx, entity); err != nil {
				return fmt.Errorf("creating project %q: %w", p.Name, err)
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

// SeedResumeData can be called repeatedly without piling up duplicates.
// fireback doesn't generate DB-level ON DELETE CASCADE for these

// so each section is deleted explicitly before the resume row itself.
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

	for _, model := range []interface{}{
		&resumedefs.WorkExperienceEntity{},
		&resumedefs.EducationEntity{},
		&resumedefs.SkillEntity{},
		&resumedefs.ProjectEntity{},
		&resumedefs.CertificationEntity{},
		&resumedefs.LanguageEntity{},
	} {
		if err := tx.Where("resume_id = ?", existing.Id).Delete(model).Error; err != nil {
			return err
		}
	}

	return tx.Delete(&existing).Error
}
