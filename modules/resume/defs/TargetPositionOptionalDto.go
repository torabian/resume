package resumedefs

import (
	"encoding"
	"encoding/json"
	"github.com/torabian/emi/emigo"
	"github.com/torabian/fireback/modules/fireback/complexes"
)

// The base class definition for targetPositionOptionalDto
type TargetPositionOptionalDto struct {
	UniqueId emigo.Nullable[string] `json:"uniqueId" yaml:"uniqueId"`
	Name     complexes.TString      `json:"name" yaml:"name"`
}

func (x *TargetPositionOptionalDto) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetTargetPositionOptionalDtoCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-id",
			Type: "string?",
		},
		{
			Name: prefix + "name",
			Type: "complex",
		},
	}
}
func CastTargetPositionOptionalDtoFromCli(c emigo.CliCastable) TargetPositionOptionalDto {
	data := TargetPositionOptionalDto{}
	if c.IsSet("unique-id") {
		emigo.ParseNullable(c.String("unique-id"), &data.UniqueId)
	}
	if c.IsSet("name") {
		if u, ok := any(&data.Name).(encoding.TextUnmarshaler); ok {
			u.UnmarshalText([]byte(c.String("name")))
		}
	}
	return data
}
