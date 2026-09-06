package resumedefs

import (
	"bytes"
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
* Action to communicate with the action ProjectAwareDeleteAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of ProjectAwareDeleteAction
func ProjectAwareDeleteAction(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error) {
	return &ProjectAwareDeleteActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func ProjectAwareDeleteActionMeta() struct {
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
		Name:        "ProjectAwareDeleteAction",
		CliName:     "delete",
		CliShort:    "d",
		URL:         "/project/delete",
		Method:      "POST",
		Description: `Deletes the given "project" uniqueIds, along with everything projectAwareDeletePreview reports.`,
	}
}

// The base class definition for projectAwareDeleteActionReq
type ProjectAwareDeleteActionReq struct {
	UniqueIds []string `json:"uniqueIds" yaml:"uniqueIds"`
}

func (x *ProjectAwareDeleteActionReq) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetProjectAwareDeleteActionReqCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-ids",
			Type: "slice",
		},
	}
}
func CastProjectAwareDeleteActionReqFromCli(c emigo.CliCastable) ProjectAwareDeleteActionReq {
	data := ProjectAwareDeleteActionReq{}
	if c.IsSet("unique-ids") {
		emigo.InflatePossibleSlice(c.String("unique-ids"), &data.UniqueIds)
	}
	return data
}

type ProjectAwareDeleteActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *ProjectAwareDeleteActionResponse) SetContentType(contentType string) *ProjectAwareDeleteActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *ProjectAwareDeleteActionResponse) AsStream(r io.Reader, contentType string) *ProjectAwareDeleteActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *ProjectAwareDeleteActionResponse) AsJSON(payload any) *ProjectAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}
func (x *ProjectAwareDeleteActionResponse) AsHTML(payload string) *ProjectAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *ProjectAwareDeleteActionResponse) AsBytes(payload []byte) *ProjectAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x ProjectAwareDeleteActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x ProjectAwareDeleteActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x ProjectAwareDeleteActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type ProjectAwareDeleteActionRequestSig = func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error)

/**
 * Query parameters for ProjectAwareDeleteAction
 */
// Query wrapper with private fields
type ProjectAwareDeleteActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func ProjectAwareDeleteActionQueryFromString(rawQuery string) ProjectAwareDeleteActionQuery {
	v := ProjectAwareDeleteActionQuery{}
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
func ProjectAwareDeleteActionQueryFromHttp(r *http.Request) ProjectAwareDeleteActionQuery {
	return ProjectAwareDeleteActionQueryFromString(r.URL.RawQuery)
}
func (q ProjectAwareDeleteActionQuery) Values() url.Values {
	return q.values
}
func (q ProjectAwareDeleteActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *ProjectAwareDeleteActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *ProjectAwareDeleteActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type ProjectAwareDeleteActionRequest struct {
	Body        ProjectAwareDeleteActionReq
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
func (x ProjectAwareDeleteActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x ProjectAwareDeleteActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func ProjectAwareDeleteActionClientCreateUrl(
	req ProjectAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := ProjectAwareDeleteActionMeta()
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
func ProjectAwareDeleteActionClientExecuteTyped(httpReq *http.Request) (*ProjectAwareDeleteActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result ProjectAwareDeleteActionResponse
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
func ProjectAwareDeleteActionClientBuildRequest(req ProjectAwareDeleteActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := ProjectAwareDeleteActionMeta()
	bodyBytes, err := json.Marshal(req.Body)
	if err != nil {
		return nil, err
	}
	httpReq, err := http.NewRequest(meta.Method, reqUrl.String(), bytes.NewReader(bodyBytes))
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
func ProjectAwareDeleteActionCall(
	req ProjectAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*ProjectAwareDeleteActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := ProjectAwareDeleteActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := ProjectAwareDeleteActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return ProjectAwareDeleteActionClientExecuteTyped(r)
}

// ProjectAwareDeleteActionRaw registers a raw Gin route for the ProjectAwareDeleteAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func ProjectAwareDeleteActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := ProjectAwareDeleteActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// ProjectAwareDeleteActionHandler returns the HTTP method, route URL, and a typed Gin handler for the ProjectAwareDeleteAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func ProjectAwareDeleteActionHandler(
	handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := ProjectAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body ProjectAwareDeleteActionReq
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := ProjectAwareDeleteActionRequest{
			Body:        body,
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

// ProjectAwareDeleteActionGin is a high-level convenience wrapper around ProjectAwareDeleteActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func ProjectAwareDeleteActionGin(r gin.IRoutes, handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error)) {
	method, url, h := ProjectAwareDeleteActionHandler(handler)
	r.Handle(method, url, h)
}
func (x ProjectAwareDeleteActionRequest) IsGin() bool {
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
func ProjectAwareDeleteActionQueryFromGin(c *gin.Context) ProjectAwareDeleteActionQuery {
	return ProjectAwareDeleteActionQueryFromString(c.Request.URL.RawQuery)
}
func (x ProjectAwareDeleteActionRequest) IsCli() bool {
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

// ProjectAwareDeleteActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the ProjectAwareDeleteAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func ProjectAwareDeleteActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetProjectAwareDeleteActionReqCliFlags(""))...)
	return flags
}

// ProjectAwareDeleteActionCliHandler builds a full *cli.Command for the
// ProjectAwareDeleteAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a ProjectAwareDeleteActionRequest the same way
// ProjectAwareDeleteActionHandler (Gin) and ProjectAwareDeleteActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func ProjectAwareDeleteActionCliHandler(
	handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error),
) *cli.Command {
	meta := ProjectAwareDeleteActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: ProjectAwareDeleteActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := ProjectAwareDeleteActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastProjectAwareDeleteActionReqFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// ProjectAwareDeleteActionCli is a high-level convenience wrapper around
// ProjectAwareDeleteActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way ProjectAwareDeleteActionGin
// registers a route on a Gin engine.
func ProjectAwareDeleteActionCli(
	app *cli.Command,
	handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error),
) {
	app.Commands = append(app.Commands, ProjectAwareDeleteActionCliHandler(handler))
}

// ProjectAwareDeleteActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the ProjectAwareDeleteAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *ProjectAwareDeleteActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func ProjectAwareDeleteActionHttpHandler(
	handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := ProjectAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body ProjectAwareDeleteActionReq
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := ProjectAwareDeleteActionRequest{
			Body:        body,
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

// ProjectAwareDeleteActionHttp is a high-level convenience wrapper around
// ProjectAwareDeleteActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func ProjectAwareDeleteActionHttp(
	mux *http.ServeMux,
	handler func(c ProjectAwareDeleteActionRequest) (*ProjectAwareDeleteActionResponse, error),
) {
	method, pattern, h := ProjectAwareDeleteActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
