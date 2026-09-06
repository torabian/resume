package resumedefs

import "github.com/torabian/emi/emigo"

/**
* Permission keys generated from the module's permissions tree.
 */
// ResumePermission mirrors the "resume" permission node (and everything nested under it),
// so it can be navigated directly, e.g. ResumePermission.Key.
var ResumePermission = emigo.Permission{
	Key:         "resume.*",
	Name:        "resume",
	Title:       map[string]string{"en": "Resume"},
	Description: map[string]string{"en": "Manage every resume section (profiles, companies, work experience, education, skills, projects, certifications, languages, target positions)."},
}

// ResumePermissionList flattens ResumePermission (and everything nested under it) into a single slice,
// for anything that wants to walk them all at once (seeding an ACL table,
// rendering a permissions picker, ...).
var ResumePermissionList = []emigo.Permission{
	ResumePermission,
}
