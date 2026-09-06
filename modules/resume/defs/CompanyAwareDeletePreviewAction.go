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
* Action to communicate with the action CompanyAwareDeletePreviewAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of CompanyAwareDeletePreviewAction
func CompanyAwareDeletePreviewAction(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error) {
	return &CompanyAwareDeletePreviewActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func CompanyAwareDeletePreviewActionMeta() struct {
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
		Name:        "CompanyAwareDeletePreviewAction",
		CliName:     "delete-preview",
		CliShort:    "dp",
		URL:         "/company/delete-preview",
		Method:      "GET",
		Description: `Reports what deleting the given "company" uniqueIds would affect, without deleting anything.`,
	}
}

// The base class definition for companyAwareDeletePreviewActionRes
type CompanyAwareDeletePreviewActionRes struct {
	Message  string                                                  `json:"message" yaml:"message"`
	Affected emigo.Array[CompanyAwareDeletePreviewActionResAffected] `json:"affected" yaml:"affected"`
}

// The base class definition for affected
type CompanyAwareDeletePreviewActionResAffected struct {
	Relation string `json:"relation" yaml:"relation"`
	Count    int64  `json:"count" yaml:"count"`
}

func (x *CompanyAwareDeletePreviewActionRes) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCompanyAwareDeletePreviewActionResCliFlags(prefix string) []emigo.CliFlag {
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
func CastCompanyAwareDeletePreviewActionResFromCli(c emigo.CliCastable) CompanyAwareDeletePreviewActionRes {
	data := CompanyAwareDeletePreviewActionRes{}
	if c.IsSet("message") {
		data.Message = c.String("message")
	}
	if c.IsSet("affected") {
		data.Affected = emigo.CapturePossibleArray(CastCompanyAwareDeletePreviewActionResAffectedFromCli, "affected", c)
	}
	return data
}
func GetCompanyAwareDeletePreviewActionResAffectedCliFlags(prefix string) []emigo.CliFlag {
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
func CastCompanyAwareDeletePreviewActionResAffectedFromCli(c emigo.CliCastable) CompanyAwareDeletePreviewActionResAffected {
	data := CompanyAwareDeletePreviewActionResAffected{}
	if c.IsSet("relation") {
		data.Relation = c.String("relation")
	}
	if c.IsSet("count") {
		data.Count = int64(c.Int64("count"))
	}
	return data
}

type CompanyAwareDeletePreviewActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *CompanyAwareDeletePreviewActionResponse) SetContentType(contentType string) *CompanyAwareDeletePreviewActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *CompanyAwareDeletePreviewActionResponse) AsStream(r io.Reader, contentType string) *CompanyAwareDeletePreviewActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *CompanyAwareDeletePreviewActionResponse) AsJSON(payload any) *CompanyAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *CompanyAwareDeletePreviewActionResponse) WithIdeal(payload CompanyAwareDeletePreviewActionRes) *CompanyAwareDeletePreviewActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *CompanyAwareDeletePreviewActionResponse) AsIdeal() (*CompanyAwareDeletePreviewActionRes, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res CompanyAwareDeletePreviewActionRes
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *CompanyAwareDeletePreviewActionResponse) AsHTML(payload string) *CompanyAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *CompanyAwareDeletePreviewActionResponse) AsBytes(payload []byte) *CompanyAwareDeletePreviewActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x CompanyAwareDeletePreviewActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x CompanyAwareDeletePreviewActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x CompanyAwareDeletePreviewActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type CompanyAwareDeletePreviewActionRequestSig = func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error)

/**
 * Query parameters for CompanyAwareDeletePreviewAction
 */
// Query wrapper with private fields
type CompanyAwareDeletePreviewActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
	UniqueIds []string `json:"uniqueIds"`
}

func CompanyAwareDeletePreviewActionQueryFromString(rawQuery string) CompanyAwareDeletePreviewActionQuery {
	v := CompanyAwareDeletePreviewActionQuery{}
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
func CompanyAwareDeletePreviewActionQueryFromHttp(r *http.Request) CompanyAwareDeletePreviewActionQuery {
	return CompanyAwareDeletePreviewActionQueryFromString(r.URL.RawQuery)
}
func (q CompanyAwareDeletePreviewActionQuery) Values() url.Values {
	return q.values
}
func (q CompanyAwareDeletePreviewActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *CompanyAwareDeletePreviewActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *CompanyAwareDeletePreviewActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type CompanyAwareDeletePreviewActionRequest struct {
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
func (x CompanyAwareDeletePreviewActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x CompanyAwareDeletePreviewActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func CompanyAwareDeletePreviewActionClientCreateUrl(
	req CompanyAwareDeletePreviewActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := CompanyAwareDeletePreviewActionMeta()
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
func CompanyAwareDeletePreviewActionClientExecuteTyped(httpReq *http.Request) (*CompanyAwareDeletePreviewActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result CompanyAwareDeletePreviewActionResponse
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
func CompanyAwareDeletePreviewActionClientBuildRequest(req CompanyAwareDeletePreviewActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := CompanyAwareDeletePreviewActionMeta()
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
func CompanyAwareDeletePreviewActionCall(
	req CompanyAwareDeletePreviewActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*CompanyAwareDeletePreviewActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := CompanyAwareDeletePreviewActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := CompanyAwareDeletePreviewActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return CompanyAwareDeletePreviewActionClientExecuteTyped(r)
}

// CompanyAwareDeletePreviewActionRaw registers a raw Gin route for the CompanyAwareDeletePreviewAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func CompanyAwareDeletePreviewActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := CompanyAwareDeletePreviewActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// CompanyAwareDeletePreviewActionHandler returns the HTTP method, route URL, and a typed Gin handler for the CompanyAwareDeletePreviewAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func CompanyAwareDeletePreviewActionHandler(
	handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := CompanyAwareDeletePreviewActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := CompanyAwareDeletePreviewActionRequest{
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

// CompanyAwareDeletePreviewActionGin is a high-level convenience wrapper around CompanyAwareDeletePreviewActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func CompanyAwareDeletePreviewActionGin(r gin.IRoutes, handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error)) {
	method, url, h := CompanyAwareDeletePreviewActionHandler(handler)
	r.Handle(method, url, h)
}
func (x CompanyAwareDeletePreviewActionRequest) IsGin() bool {
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
func CompanyAwareDeletePreviewActionQueryFromGin(c *gin.Context) CompanyAwareDeletePreviewActionQuery {
	return CompanyAwareDeletePreviewActionQueryFromString(c.Request.URL.RawQuery)
}
func GetCompanyAwareDeletePreviewActionQueryCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "qs-unique-ids",
			Type: "slice",
		},
	}
}

// CompanyAwareDeletePreviewActionQueryFromCli extracts and casts query parameters the same way
// CompanyAwareDeletePreviewActionQueryFromString does, but reads them off urfave v3 CLI flags instead
// of a raw query string. The underlying url.Values (as returned by .Values()) is filled
// in using each field's real name, so code consuming req.QueryParams behaves the same
// whether the request came from HTTP or from the CLI.
func CompanyAwareDeletePreviewActionQueryFromCli(c *cli.Command) CompanyAwareDeletePreviewActionQuery {
	data := CompanyAwareDeletePreviewActionQuery{}
	values := url.Values{}
	if c.IsSet("qs-unique-ids") {
		raw := c.String("qs-unique-ids")
		emigo.InflatePossibleSlice(raw, &data.UniqueIds)
		values.Set("uniqueIds", raw)
	}
	data.SetValues(values)
	return data
}
func (x CompanyAwareDeletePreviewActionRequest) IsCli() bool {
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

// CompanyAwareDeletePreviewActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the CompanyAwareDeletePreviewAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func CompanyAwareDeletePreviewActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetCompanyAwareDeletePreviewActionQueryCliFlags(""))...)
	return flags
}

// CompanyAwareDeletePreviewActionCliHandler builds a full *cli.Command for the
// CompanyAwareDeletePreviewAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a CompanyAwareDeletePreviewActionRequest the same way
// CompanyAwareDeletePreviewActionHandler (Gin) and CompanyAwareDeletePreviewActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func CompanyAwareDeletePreviewActionCliHandler(
	handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error),
) *cli.Command {
	meta := CompanyAwareDeletePreviewActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: CompanyAwareDeletePreviewActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := CompanyAwareDeletePreviewActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
		}
		req.QueryParams = CompanyAwareDeletePreviewActionQueryFromCli(c).Values()
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// CompanyAwareDeletePreviewActionCli is a high-level convenience wrapper around
// CompanyAwareDeletePreviewActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way CompanyAwareDeletePreviewActionGin
// registers a route on a Gin engine.
func CompanyAwareDeletePreviewActionCli(
	app *cli.Command,
	handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error),
) {
	app.Commands = append(app.Commands, CompanyAwareDeletePreviewActionCliHandler(handler))
}

// CompanyAwareDeletePreviewActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the CompanyAwareDeletePreviewAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *CompanyAwareDeletePreviewActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func CompanyAwareDeletePreviewActionHttpHandler(
	handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := CompanyAwareDeletePreviewActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := CompanyAwareDeletePreviewActionRequest{
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

// CompanyAwareDeletePreviewActionHttp is a high-level convenience wrapper around
// CompanyAwareDeletePreviewActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func CompanyAwareDeletePreviewActionHttp(
	mux *http.ServeMux,
	handler func(c CompanyAwareDeletePreviewActionRequest) (*CompanyAwareDeletePreviewActionResponse, error),
) {
	method, pattern, h := CompanyAwareDeletePreviewActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
