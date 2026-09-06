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
* Action to communicate with the action LanguageBrowseAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of LanguageBrowseAction
func LanguageBrowseAction(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error) {
	return &LanguageBrowseActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func LanguageBrowseActionMeta() struct {
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
		Name:        "LanguageBrowseAction",
		CliName:     "browse",
		CliShort:    "b",
		URL:         "/language/browse",
		Method:      "GET",
		Description: `Returns "language" rows matching a filter, sorted/paged (see emigorm.ApplyQueryFilter/ApplyQueryScope).`,
	}
}

type LanguageBrowseActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *LanguageBrowseActionResponse) SetContentType(contentType string) *LanguageBrowseActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *LanguageBrowseActionResponse) AsStream(r io.Reader, contentType string) *LanguageBrowseActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *LanguageBrowseActionResponse) AsJSON(payload any) *LanguageBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *LanguageBrowseActionResponse) WithIdeal(payload LanguageOptionalDto) *LanguageBrowseActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *LanguageBrowseActionResponse) AsIdeal() (*LanguageOptionalDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res LanguageOptionalDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *LanguageBrowseActionResponse) AsHTML(payload string) *LanguageBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *LanguageBrowseActionResponse) AsBytes(payload []byte) *LanguageBrowseActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x LanguageBrowseActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x LanguageBrowseActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x LanguageBrowseActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type LanguageBrowseActionRequestSig = func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error)

/**
 * Query parameters for LanguageBrowseAction
 */
// Query wrapper with private fields
type LanguageBrowseActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
	Filter       string `json:"filter"`
	Sort         string `json:"sort"`
	StartIndex   int    `json:"startIndex"`
	ItemsPerPage int    `json:"itemsPerPage"`
	Cursor       string `json:"cursor"`
}

func LanguageBrowseActionQueryFromString(rawQuery string) LanguageBrowseActionQuery {
	v := LanguageBrowseActionQuery{}
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
func LanguageBrowseActionQueryFromHttp(r *http.Request) LanguageBrowseActionQuery {
	return LanguageBrowseActionQueryFromString(r.URL.RawQuery)
}
func (q LanguageBrowseActionQuery) Values() url.Values {
	return q.values
}
func (q LanguageBrowseActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *LanguageBrowseActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *LanguageBrowseActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type LanguageBrowseActionRequest struct {
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
func (x LanguageBrowseActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x LanguageBrowseActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func LanguageBrowseActionClientCreateUrl(
	req LanguageBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := LanguageBrowseActionMeta()
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
func LanguageBrowseActionClientExecuteTyped(httpReq *http.Request) (*LanguageBrowseActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result LanguageBrowseActionResponse
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
func LanguageBrowseActionClientBuildRequest(req LanguageBrowseActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := LanguageBrowseActionMeta()
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
func LanguageBrowseActionCall(
	req LanguageBrowseActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*LanguageBrowseActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := LanguageBrowseActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := LanguageBrowseActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return LanguageBrowseActionClientExecuteTyped(r)
}

// LanguageBrowseActionRaw registers a raw Gin route for the LanguageBrowseAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func LanguageBrowseActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := LanguageBrowseActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// LanguageBrowseActionHandler returns the HTTP method, route URL, and a typed Gin handler for the LanguageBrowseAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func LanguageBrowseActionHandler(
	handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := LanguageBrowseActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := LanguageBrowseActionRequest{
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

// LanguageBrowseActionGin is a high-level convenience wrapper around LanguageBrowseActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func LanguageBrowseActionGin(r gin.IRoutes, handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error)) {
	method, url, h := LanguageBrowseActionHandler(handler)
	r.Handle(method, url, h)
}
func (x LanguageBrowseActionRequest) IsGin() bool {
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
func LanguageBrowseActionQueryFromGin(c *gin.Context) LanguageBrowseActionQuery {
	return LanguageBrowseActionQueryFromString(c.Request.URL.RawQuery)
}
func GetLanguageBrowseActionQueryCliFlags(prefix string) []emigo.CliFlag {
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

// LanguageBrowseActionQueryFromCli extracts and casts query parameters the same way
// LanguageBrowseActionQueryFromString does, but reads them off urfave v3 CLI flags instead
// of a raw query string. The underlying url.Values (as returned by .Values()) is filled
// in using each field's real name, so code consuming req.QueryParams behaves the same
// whether the request came from HTTP or from the CLI.
func LanguageBrowseActionQueryFromCli(c *cli.Command) LanguageBrowseActionQuery {
	data := LanguageBrowseActionQuery{}
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
func (x LanguageBrowseActionRequest) IsCli() bool {
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

// LanguageBrowseActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the LanguageBrowseAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func LanguageBrowseActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetLanguageBrowseActionQueryCliFlags(""))...)
	return flags
}

// LanguageBrowseActionCliHandler builds a full *cli.Command for the
// LanguageBrowseAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a LanguageBrowseActionRequest the same way
// LanguageBrowseActionHandler (Gin) and LanguageBrowseActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func LanguageBrowseActionCliHandler(
	handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error),
) *cli.Command {
	meta := LanguageBrowseActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: LanguageBrowseActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := LanguageBrowseActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
		}
		req.QueryParams = LanguageBrowseActionQueryFromCli(c).Values()
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// LanguageBrowseActionCli is a high-level convenience wrapper around
// LanguageBrowseActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way LanguageBrowseActionGin
// registers a route on a Gin engine.
func LanguageBrowseActionCli(
	app *cli.Command,
	handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error),
) {
	app.Commands = append(app.Commands, LanguageBrowseActionCliHandler(handler))
}

// LanguageBrowseActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the LanguageBrowseAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *LanguageBrowseActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func LanguageBrowseActionHttpHandler(
	handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := LanguageBrowseActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := LanguageBrowseActionRequest{
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

// LanguageBrowseActionHttp is a high-level convenience wrapper around
// LanguageBrowseActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func LanguageBrowseActionHttp(
	mux *http.ServeMux,
	handler func(c LanguageBrowseActionRequest) (*LanguageBrowseActionResponse, error),
) {
	method, pattern, h := LanguageBrowseActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
