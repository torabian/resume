package resumedefs

import (
	"context"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/torabian/emi/emigo"
	"github.com/urfave/cli/v3"
	"io"
	"net/http"
	"net/url"
	"reflect"
)

/**
* Action to communicate with the action SkillAwareDeletePreviewAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of SkillAwareDeletePreviewAction
func SkillAwareDeletePreviewAction(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error) {
	return &SkillAwareDeletePreviewActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func SkillAwareDeletePreviewActionMeta() struct {
	Name        string
	CliName     string
	CliShort    string
	URL         string
	Method      string
	Description string
} {
	return struct {
		Name        string
		CliName     string
		CliShort    string
		URL         string
		Method      string
		Description string
	}{
		Name:        "SkillAwareDeletePreviewAction",
		CliName:     "delete-preview",
		CliShort:    "dp",
		URL:         "/skill/delete-preview",
		Method:      "GET",
		Description: `Reports what deleting the given "skill" uniqueIds would affect, without deleting anything.`,
	}
}

// The base class definition for skillAwareDeletePreviewActionRes
type SkillAwareDeletePreviewActionRes struct {
	Message  string                                                `json:"message" yaml:"message"`
	Affected emigo.Array[SkillAwareDeletePreviewActionResAffected] `json:"affected" yaml:"affected"`
}

// The base class definition for affected
type SkillAwareDeletePreviewActionResAffected struct {
	Relation string `json:"relation" yaml:"relation"`
	Count    int64  `json:"count" yaml:"count"`
}

func (x *SkillAwareDeletePreviewActionRes) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetSkillAwareDeletePreviewActionResCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "message",
			Type: "string",
		},
		{
			Name: prefix + "affected",
			Type: "array",
		},
	}
}
func CastSkillAwareDeletePreviewActionResFromCli(c emigo.CliCastable) SkillAwareDeletePreviewActionRes {
	data := SkillAwareDeletePreviewActionRes{}
	if c.IsSet("message") {
		data.Message = c.String("message")
	}
	if c.IsSet("affected") {
		data.Affected = emigo.CapturePossibleArray(CastSkillAwareDeletePreviewActionResAffectedFromCli, "affected", c)
	}
	return data
}
func GetSkillAwareDeletePreviewActionResAffectedCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "relation",
			Type: "string",
		},
		{
			Name: prefix + "count",
			Type: "int64",
		},
	}
}
func CastSkillAwareDeletePreviewActionResAffectedFromCli(c emigo.CliCastable) SkillAwareDeletePreviewActionResAffected {
	data := SkillAwareDeletePreviewActionResAffected{}
	if c.IsSet("relation") {
		data.Relation = c.String("relation")
	}
	if c.IsSet("count") {
		data.Count = int64(c.Int64("count"))
	}
	return data
}

type SkillAwareDeletePreviewActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *SkillAwareDeletePreviewActionResponse) SetContentType(contentType string) *SkillAwareDeletePreviewActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *SkillAwareDeletePreviewActionResponse) AsStream(r io.Reader, contentType string) *SkillAwareDeletePreviewActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *SkillAwareDeletePreviewActionResponse) AsJSON(payload any) *SkillAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *SkillAwareDeletePreviewActionResponse) WithIdeal(payload SkillAwareDeletePreviewActionRes) *SkillAwareDeletePreviewActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *SkillAwareDeletePreviewActionResponse) AsIdeal() (*SkillAwareDeletePreviewActionRes, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res SkillAwareDeletePreviewActionRes
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *SkillAwareDeletePreviewActionResponse) AsHTML(payload string) *SkillAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *SkillAwareDeletePreviewActionResponse) AsBytes(payload []byte) *SkillAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x SkillAwareDeletePreviewActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x SkillAwareDeletePreviewActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x SkillAwareDeletePreviewActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type SkillAwareDeletePreviewActionRequestSig = func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error)

/**
 * Query parameters for SkillAwareDeletePreviewAction
 */
// Query wrapper with private fields
type SkillAwareDeletePreviewActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
	UniqueIds []string `json:"uniqueIds"`
}

func SkillAwareDeletePreviewActionQueryFromString(rawQuery string) SkillAwareDeletePreviewActionQuery {
	v := SkillAwareDeletePreviewActionQuery{}
	values, _ := url.ParseQuery(rawQuery)
	mapped := map[string]interface{}{}
	if result, err := emigo.UnmarshalQs(rawQuery); err == nil {
		mapped = result
	}
	decoder, err := emigo.NewDecoder(&emigo.DecoderConfig{
		TagName:          "json", // reuse json tags
		WeaklyTypedInput: true,   // "1" -> int, "true" -> bool
		Result:           &v,
	})
	if err == nil {
		_ = decoder.Decode(mapped)
	}
	v.values = values
	v.mapped = mapped
	return v
}
func SkillAwareDeletePreviewActionQueryFromHttp(r *http.Request) SkillAwareDeletePreviewActionQuery {
	return SkillAwareDeletePreviewActionQueryFromString(r.URL.RawQuery)
}
func (q SkillAwareDeletePreviewActionQuery) Values() url.Values {
	return q.values
}
func (q SkillAwareDeletePreviewActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *SkillAwareDeletePreviewActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *SkillAwareDeletePreviewActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type SkillAwareDeletePreviewActionRequest struct {
	Body        interface{}
	QueryParams url.Values
	// Automatically casted headers, for purpose of typesafe headers in later versions
	Headers http.Header
	// Gin context for each request in case of a direct access requirement
	// Now it's interface, so the code gen doesn't depend on the instance
	// or gin package. Make sure you cast is later into *gin.Context, or whatever
	// your framework is passing when creating a request.
	// Ideally, you should not be needing this, and emi has to provide necessary helper
	// functions to read and write a request.
	GinCtx interface{}
	// Cli library helper (urfave) by default. The instance is interface{}, and you
	// need to manually cast it to the *cli.Command, so gives you freedom and independence
	// of external library.
	// Ideally, you should not be needing this, and emi has to provide necessary helper
	// functions to read and write a request.
	CliCtx interface{}
	// Reference to the application instance, in such scenarios that entire
	// application is wrapped into a single struct that holds database connection,
	// routes, etc.
	Application interface{}
}

// Returns the gin ctx. You need to manually cast this to .(*gin.Context)
func (x SkillAwareDeletePreviewActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x SkillAwareDeletePreviewActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func SkillAwareDeletePreviewActionClientCreateUrl(
	req SkillAwareDeletePreviewActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := SkillAwareDeletePreviewActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// Build final URL with query string
	u, err := url.Parse(urlAddr)
	if err != nil {
		return nil, err
	}
	// if UrlValues present, encode and append
	if len(req.QueryParams) > 0 {
		u.RawQuery = req.QueryParams.Encode()
	}
	return u, nil
}
func SkillAwareDeletePreviewActionClientExecuteTyped(httpReq *http.Request) (*SkillAwareDeletePreviewActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result SkillAwareDeletePreviewActionResponse
	result.resp = resp
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return &result, err
	}
	if err := json.Unmarshal(respBody, &result.Payload); err != nil {
		return &result, err
	}
	return &result, nil
}
func SkillAwareDeletePreviewActionClientBuildRequest(req SkillAwareDeletePreviewActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := SkillAwareDeletePreviewActionMeta()
	httpReq, err := http.NewRequest(meta.Method, reqUrl.String(), nil)
	if err != nil {
		return nil, err
	}
	httpReq.Header = make(http.Header)
	// copy defaults
	for k, v := range config.Headers {
		for _, vv := range v {
			httpReq.Header.Add(k, vv)
		}
	}
	// override with request-specific headers
	for k, v := range req.Headers {
		httpReq.Header.Del(k) // ensure override, not duplicate
		for _, vv := range v {
			httpReq.Header.Add(k, vv)
		}
	}
	return httpReq, nil
}
func SkillAwareDeletePreviewActionCall(
	req SkillAwareDeletePreviewActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*SkillAwareDeletePreviewActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := SkillAwareDeletePreviewActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := SkillAwareDeletePreviewActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return SkillAwareDeletePreviewActionClientExecuteTyped(r)
}

// SkillAwareDeletePreviewActionRaw registers a raw Gin route for the SkillAwareDeletePreviewAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func SkillAwareDeletePreviewActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := SkillAwareDeletePreviewActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// SkillAwareDeletePreviewActionHandler returns the HTTP method, route URL, and a typed Gin handler for the SkillAwareDeletePreviewAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func SkillAwareDeletePreviewActionHandler(
	handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := SkillAwareDeletePreviewActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := SkillAwareDeletePreviewActionRequest{
			Body:        nil,
			QueryParams: m.Request.URL.Query(),
			Headers:     m.Request.Header,
			GinCtx:      m,
		}
		resp, err := handler(req)
		if err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// If the handler returned nil (and no error), it means the response was handled manually.
		if resp == nil {
			return
		}
		emigo.RenderGinResult(m, resp)
	}
}

// SkillAwareDeletePreviewActionGin is a high-level convenience wrapper around SkillAwareDeletePreviewActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func SkillAwareDeletePreviewActionGin(r gin.IRoutes, handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error)) {
	method, url, h := SkillAwareDeletePreviewActionHandler(handler)
	r.Handle(method, url, h)
}
func (x SkillAwareDeletePreviewActionRequest) IsGin() bool {
	if x.GinCtx == nil {
		return false
	}
	v := reflect.ValueOf(x.GinCtx)
	switch v.Kind() {
	case reflect.Ptr, reflect.Map, reflect.Slice, reflect.Interface, reflect.Func, reflect.Chan:
		return !v.IsNil()
	}
	return true
}
func SkillAwareDeletePreviewActionQueryFromGin(c *gin.Context) SkillAwareDeletePreviewActionQuery {
	return SkillAwareDeletePreviewActionQueryFromString(c.Request.URL.RawQuery)
}
func GetSkillAwareDeletePreviewActionQueryCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "qs-unique-ids",
			Type: "slice",
		},
	}
}

// SkillAwareDeletePreviewActionQueryFromCli extracts and casts query parameters the same way
// SkillAwareDeletePreviewActionQueryFromString does, but reads them off urfave v3 CLI flags instead
// of a raw query string. The underlying url.Values (as returned by .Values()) is filled
// in using each field's real name, so code consuming req.QueryParams behaves the same
// whether the request came from HTTP or from the CLI.
func SkillAwareDeletePreviewActionQueryFromCli(c *cli.Command) SkillAwareDeletePreviewActionQuery {
	data := SkillAwareDeletePreviewActionQuery{}
	values := url.Values{}
	if c.IsSet("qs-unique-ids") {
		raw := c.String("qs-unique-ids")
		emigo.InflatePossibleSlice(raw, &data.UniqueIds)
		values.Set("uniqueIds", raw)
	}
	data.SetValues(values)
	return data
}
func (x SkillAwareDeletePreviewActionRequest) IsCli() bool {
	if x.CliCtx == nil {
		return false
	}
	v := reflect.ValueOf(x.CliCtx)
	switch v.Kind() {
	case reflect.Ptr, reflect.Map, reflect.Slice, reflect.Interface, reflect.Func, reflect.Chan:
		return !v.IsNil()
	}
	return true
}

// SkillAwareDeletePreviewActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the SkillAwareDeletePreviewAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func SkillAwareDeletePreviewActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetSkillAwareDeletePreviewActionQueryCliFlags(""))...)
	return flags
}

// SkillAwareDeletePreviewActionCliHandler builds a full *cli.Command for the
// SkillAwareDeletePreviewAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a SkillAwareDeletePreviewActionRequest the same way
// SkillAwareDeletePreviewActionHandler (Gin) and SkillAwareDeletePreviewActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func SkillAwareDeletePreviewActionCliHandler(
	handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error),
) *cli.Command {
	meta := SkillAwareDeletePreviewActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: SkillAwareDeletePreviewActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := SkillAwareDeletePreviewActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
		}
		req.QueryParams = SkillAwareDeletePreviewActionQueryFromCli(c).Values()
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// SkillAwareDeletePreviewActionCli is a high-level convenience wrapper around
// SkillAwareDeletePreviewActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way SkillAwareDeletePreviewActionGin
// registers a route on a Gin engine.
func SkillAwareDeletePreviewActionCli(
	app *cli.Command,
	handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error),
) {
	app.Commands = append(app.Commands, SkillAwareDeletePreviewActionCliHandler(handler))
}

// SkillAwareDeletePreviewActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the SkillAwareDeletePreviewAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *SkillAwareDeletePreviewActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func SkillAwareDeletePreviewActionHttpHandler(
	handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := SkillAwareDeletePreviewActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := SkillAwareDeletePreviewActionRequest{
			Body:        nil,
			QueryParams: r.URL.Query(),
			Headers:     r.Header,
		}
		resp, err := handler(req)
		if err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// If the handler returned nil (and no error), the response was handled
		// manually.
		if resp == nil {
			return
		}
		emigo.RenderHttpResult(w, r, resp)
	}
}

// SkillAwareDeletePreviewActionHttp is a high-level convenience wrapper around
// SkillAwareDeletePreviewActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func SkillAwareDeletePreviewActionHttp(
	mux *http.ServeMux,
	handler func(c SkillAwareDeletePreviewActionRequest) (*SkillAwareDeletePreviewActionResponse, error),
) {
	method, pattern, h := SkillAwareDeletePreviewActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
