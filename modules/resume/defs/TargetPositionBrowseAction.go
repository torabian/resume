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
* Action to communicate with the action TargetPositionBrowseAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of TargetPositionBrowseAction
func TargetPositionBrowseAction(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error) {
	return &TargetPositionBrowseActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func TargetPositionBrowseActionMeta() struct {
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
		Name:        "TargetPositionBrowseAction",
		CliName:     "browse",
		CliShort:    "b",
		URL:         "/targetPosition/browse",
		Method:      "GET",
		Description: `Returns "targetPosition" rows matching a filter, sorted/paged (see emigorm.ApplyQueryFilter/ApplyQueryScope).`,
	}
}

type TargetPositionBrowseActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *TargetPositionBrowseActionResponse) SetContentType(contentType string) *TargetPositionBrowseActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *TargetPositionBrowseActionResponse) AsStream(r io.Reader, contentType string) *TargetPositionBrowseActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *TargetPositionBrowseActionResponse) AsJSON(payload any) *TargetPositionBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *TargetPositionBrowseActionResponse) WithIdeal(payload TargetPositionOptionalDto) *TargetPositionBrowseActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *TargetPositionBrowseActionResponse) AsIdeal() (*TargetPositionOptionalDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res TargetPositionOptionalDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *TargetPositionBrowseActionResponse) AsHTML(payload string) *TargetPositionBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *TargetPositionBrowseActionResponse) AsBytes(payload []byte) *TargetPositionBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x TargetPositionBrowseActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x TargetPositionBrowseActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x TargetPositionBrowseActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type TargetPositionBrowseActionRequestSig = func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error)

/**
 * Query parameters for TargetPositionBrowseAction
 */
// Query wrapper with private fields
type TargetPositionBrowseActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
	Filter       string `json:"filter"`
	Sort         string `json:"sort"`
	StartIndex   int    `json:"startIndex"`
	ItemsPerPage int    `json:"itemsPerPage"`
	Cursor       string `json:"cursor"`
}

func TargetPositionBrowseActionQueryFromString(rawQuery string) TargetPositionBrowseActionQuery {
	v := TargetPositionBrowseActionQuery{}
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
func TargetPositionBrowseActionQueryFromHttp(r *http.Request) TargetPositionBrowseActionQuery {
	return TargetPositionBrowseActionQueryFromString(r.URL.RawQuery)
}
func (q TargetPositionBrowseActionQuery) Values() url.Values {
	return q.values
}
func (q TargetPositionBrowseActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *TargetPositionBrowseActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *TargetPositionBrowseActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type TargetPositionBrowseActionRequest struct {
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
func (x TargetPositionBrowseActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x TargetPositionBrowseActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func TargetPositionBrowseActionClientCreateUrl(
	req TargetPositionBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := TargetPositionBrowseActionMeta()
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
func TargetPositionBrowseActionClientExecuteTyped(httpReq *http.Request) (*TargetPositionBrowseActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result TargetPositionBrowseActionResponse
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
func TargetPositionBrowseActionClientBuildRequest(req TargetPositionBrowseActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := TargetPositionBrowseActionMeta()
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
func TargetPositionBrowseActionCall(
	req TargetPositionBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*TargetPositionBrowseActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := TargetPositionBrowseActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := TargetPositionBrowseActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return TargetPositionBrowseActionClientExecuteTyped(r)
}

// TargetPositionBrowseActionRaw registers a raw Gin route for the TargetPositionBrowseAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func TargetPositionBrowseActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := TargetPositionBrowseActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// TargetPositionBrowseActionHandler returns the HTTP method, route URL, and a typed Gin handler for the TargetPositionBrowseAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func TargetPositionBrowseActionHandler(
	handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := TargetPositionBrowseActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := TargetPositionBrowseActionRequest{
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

// TargetPositionBrowseActionGin is a high-level convenience wrapper around TargetPositionBrowseActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func TargetPositionBrowseActionGin(r gin.IRoutes, handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error)) {
	method, url, h := TargetPositionBrowseActionHandler(handler)
	r.Handle(method, url, h)
}
func (x TargetPositionBrowseActionRequest) IsGin() bool {
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
func TargetPositionBrowseActionQueryFromGin(c *gin.Context) TargetPositionBrowseActionQuery {
	return TargetPositionBrowseActionQueryFromString(c.Request.URL.RawQuery)
}
func GetTargetPositionBrowseActionQueryCliFlags(prefix string) []emigo.CliFlag {
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

// TargetPositionBrowseActionQueryFromCli extracts and casts query parameters the same way
// TargetPositionBrowseActionQueryFromString does, but reads them off urfave v3 CLI flags instead
// of a raw query string. The underlying url.Values (as returned by .Values()) is filled
// in using each field's real name, so code consuming req.QueryParams behaves the same
// whether the request came from HTTP or from the CLI.
func TargetPositionBrowseActionQueryFromCli(c *cli.Command) TargetPositionBrowseActionQuery {
	data := TargetPositionBrowseActionQuery{}
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
func (x TargetPositionBrowseActionRequest) IsCli() bool {
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

// TargetPositionBrowseActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the TargetPositionBrowseAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func TargetPositionBrowseActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetTargetPositionBrowseActionQueryCliFlags(""))...)
	return flags
}

// TargetPositionBrowseActionCliHandler builds a full *cli.Command for the
// TargetPositionBrowseAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a TargetPositionBrowseActionRequest the same way
// TargetPositionBrowseActionHandler (Gin) and TargetPositionBrowseActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func TargetPositionBrowseActionCliHandler(
	handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error),
) *cli.Command {
	meta := TargetPositionBrowseActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: TargetPositionBrowseActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := TargetPositionBrowseActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
		}
		req.QueryParams = TargetPositionBrowseActionQueryFromCli(c).Values()
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// TargetPositionBrowseActionCli is a high-level convenience wrapper around
// TargetPositionBrowseActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way TargetPositionBrowseActionGin
// registers a route on a Gin engine.
func TargetPositionBrowseActionCli(
	app *cli.Command,
	handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error),
) {
	app.Commands = append(app.Commands, TargetPositionBrowseActionCliHandler(handler))
}

// TargetPositionBrowseActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the TargetPositionBrowseAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *TargetPositionBrowseActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func TargetPositionBrowseActionHttpHandler(
	handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := TargetPositionBrowseActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := TargetPositionBrowseActionRequest{
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

// TargetPositionBrowseActionHttp is a high-level convenience wrapper around
// TargetPositionBrowseActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func TargetPositionBrowseActionHttp(
	mux *http.ServeMux,
	handler func(c TargetPositionBrowseActionRequest) (*TargetPositionBrowseActionResponse, error),
) {
	method, pattern, h := TargetPositionBrowseActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
