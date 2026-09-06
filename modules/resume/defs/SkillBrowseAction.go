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
	"strconv"
)

/**
* Action to communicate with the action SkillBrowseAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of SkillBrowseAction
func SkillBrowseAction(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error) {
	return &SkillBrowseActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func SkillBrowseActionMeta() struct {
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
		Name:        "SkillBrowseAction",
		CliName:     "browse",
		CliShort:    "b",
		URL:         "/skill/browse",
		Method:      "GET",
		Description: `Returns "skill" rows matching a filter, sorted/paged (see emigorm.ApplyQueryFilter/ApplyQueryScope).`,
	}
}

type SkillBrowseActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *SkillBrowseActionResponse) SetContentType(contentType string) *SkillBrowseActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *SkillBrowseActionResponse) AsStream(r io.Reader, contentType string) *SkillBrowseActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *SkillBrowseActionResponse) AsJSON(payload any) *SkillBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *SkillBrowseActionResponse) WithIdeal(payload SkillOptionalDto) *SkillBrowseActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *SkillBrowseActionResponse) AsIdeal() (*SkillOptionalDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res SkillOptionalDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *SkillBrowseActionResponse) AsHTML(payload string) *SkillBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *SkillBrowseActionResponse) AsBytes(payload []byte) *SkillBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x SkillBrowseActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x SkillBrowseActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x SkillBrowseActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type SkillBrowseActionRequestSig = func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error)

/**
 * Query parameters for SkillBrowseAction
 */
// Query wrapper with private fields
type SkillBrowseActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
	Filter       string `json:"filter"`
	Sort         string `json:"sort"`
	StartIndex   int    `json:"startIndex"`
	ItemsPerPage int    `json:"itemsPerPage"`
	Cursor       string `json:"cursor"`
}

func SkillBrowseActionQueryFromString(rawQuery string) SkillBrowseActionQuery {
	v := SkillBrowseActionQuery{}
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
func SkillBrowseActionQueryFromHttp(r *http.Request) SkillBrowseActionQuery {
	return SkillBrowseActionQueryFromString(r.URL.RawQuery)
}
func (q SkillBrowseActionQuery) Values() url.Values {
	return q.values
}
func (q SkillBrowseActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *SkillBrowseActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *SkillBrowseActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type SkillBrowseActionRequest struct {
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
func (x SkillBrowseActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x SkillBrowseActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func SkillBrowseActionClientCreateUrl(
	req SkillBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := SkillBrowseActionMeta()
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
func SkillBrowseActionClientExecuteTyped(httpReq *http.Request) (*SkillBrowseActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result SkillBrowseActionResponse
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
func SkillBrowseActionClientBuildRequest(req SkillBrowseActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := SkillBrowseActionMeta()
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
func SkillBrowseActionCall(
	req SkillBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*SkillBrowseActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := SkillBrowseActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := SkillBrowseActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return SkillBrowseActionClientExecuteTyped(r)
}

// SkillBrowseActionRaw registers a raw Gin route for the SkillBrowseAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func SkillBrowseActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := SkillBrowseActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// SkillBrowseActionHandler returns the HTTP method, route URL, and a typed Gin handler for the SkillBrowseAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func SkillBrowseActionHandler(
	handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := SkillBrowseActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := SkillBrowseActionRequest{
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

// SkillBrowseActionGin is a high-level convenience wrapper around SkillBrowseActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func SkillBrowseActionGin(r gin.IRoutes, handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error)) {
	method, url, h := SkillBrowseActionHandler(handler)
	r.Handle(method, url, h)
}
func (x SkillBrowseActionRequest) IsGin() bool {
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
func SkillBrowseActionQueryFromGin(c *gin.Context) SkillBrowseActionQuery {
	return SkillBrowseActionQueryFromString(c.Request.URL.RawQuery)
}
func GetSkillBrowseActionQueryCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "qs-filter",
			Type: "string",
		},
		{
			Name: prefix + "qs-sort",
			Type: "string",
		},
		{
			Name: prefix + "qs-start-index",
			Type: "int",
		},
		{
			Name: prefix + "qs-items-per-page",
			Type: "int",
		},
		{
			Name: prefix + "qs-cursor",
			Type: "string",
		},
	}
}

// SkillBrowseActionQueryFromCli extracts and casts query parameters the same way
// SkillBrowseActionQueryFromString does, but reads them off urfave v3 CLI flags instead
// of a raw query string. The underlying url.Values (as returned by .Values()) is filled
// in using each field's real name, so code consuming req.QueryParams behaves the same
// whether the request came from HTTP or from the CLI.
func SkillBrowseActionQueryFromCli(c *cli.Command) SkillBrowseActionQuery {
	data := SkillBrowseActionQuery{}
	values := url.Values{}
	if c.IsSet("qs-filter") {
		data.Filter = c.String("qs-filter")
		values.Set("filter", data.Filter)
	}
	if c.IsSet("qs-sort") {
		data.Sort = c.String("qs-sort")
		values.Set("sort", data.Sort)
	}
	if c.IsSet("qs-start-index") {
		data.StartIndex = int(c.Int64("qs-start-index"))
		values.Set("startIndex", strconv.FormatInt(int64(data.StartIndex), 10))
	}
	if c.IsSet("qs-items-per-page") {
		data.ItemsPerPage = int(c.Int64("qs-items-per-page"))
		values.Set("itemsPerPage", strconv.FormatInt(int64(data.ItemsPerPage), 10))
	}
	if c.IsSet("qs-cursor") {
		data.Cursor = c.String("qs-cursor")
		values.Set("cursor", data.Cursor)
	}
	data.SetValues(values)
	return data
}
func (x SkillBrowseActionRequest) IsCli() bool {
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

// SkillBrowseActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the SkillBrowseAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func SkillBrowseActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetSkillBrowseActionQueryCliFlags(""))...)
	return flags
}

// SkillBrowseActionCliHandler builds a full *cli.Command for the
// SkillBrowseAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a SkillBrowseActionRequest the same way
// SkillBrowseActionHandler (Gin) and SkillBrowseActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func SkillBrowseActionCliHandler(
	handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error),
) *cli.Command {
	meta := SkillBrowseActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: SkillBrowseActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := SkillBrowseActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
		}
		req.QueryParams = SkillBrowseActionQueryFromCli(c).Values()
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// SkillBrowseActionCli is a high-level convenience wrapper around
// SkillBrowseActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way SkillBrowseActionGin
// registers a route on a Gin engine.
func SkillBrowseActionCli(
	app *cli.Command,
	handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error),
) {
	app.Commands = append(app.Commands, SkillBrowseActionCliHandler(handler))
}

// SkillBrowseActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the SkillBrowseAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *SkillBrowseActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func SkillBrowseActionHttpHandler(
	handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := SkillBrowseActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := SkillBrowseActionRequest{
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

// SkillBrowseActionHttp is a high-level convenience wrapper around
// SkillBrowseActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func SkillBrowseActionHttp(
	mux *http.ServeMux,
	handler func(c SkillBrowseActionRequest) (*SkillBrowseActionResponse, error),
) {
	method, pattern, h := SkillBrowseActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
