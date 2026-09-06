package resumedefs

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/torabian/emi/emigo"
	"github.com/urfave/cli/v3"
	"io"
	"net/http"
	"net/url"
	"reflect"
	"strings"
)

/**
* Action to communicate with the action ProjectGetAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of ProjectGetAction
func ProjectGetAction(c ProjectGetActionRequest) (*ProjectGetActionResponse, error) {
	return &ProjectGetActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func ProjectGetActionMeta() struct {
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
		Name:        "ProjectGetAction",
		CliName:     "get",
		CliShort:    "g",
		URL:         "/project/:uniqueId",
		Method:      "GET",
		Description: `Looks up a single "project" row by uniqueId.`,
	}
}

type ProjectGetActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *ProjectGetActionResponse) SetContentType(contentType string) *ProjectGetActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *ProjectGetActionResponse) AsStream(r io.Reader, contentType string) *ProjectGetActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *ProjectGetActionResponse) AsJSON(payload any) *ProjectGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *ProjectGetActionResponse) WithIdeal(payload ProjectDto) *ProjectGetActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *ProjectGetActionResponse) AsIdeal() (*ProjectDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res ProjectDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *ProjectGetActionResponse) AsHTML(payload string) *ProjectGetActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *ProjectGetActionResponse) AsBytes(payload []byte) *ProjectGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x ProjectGetActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x ProjectGetActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x ProjectGetActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type ProjectGetActionRequestSig = func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error)

/**
 * Path parameters for ProjectGetAction
 */
type ProjectGetActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func ProjectGetActionPathParameterApply(params ProjectGetActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func ProjectGetActionPathParameterFromFn(fn func(key string) string) ProjectGetActionPathParameter {
	res := ProjectGetActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for ProjectGetAction
 */
// Query wrapper with private fields
type ProjectGetActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func ProjectGetActionQueryFromString(rawQuery string) ProjectGetActionQuery {
	v := ProjectGetActionQuery{}
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
func ProjectGetActionQueryFromHttp(r *http.Request) ProjectGetActionQuery {
	return ProjectGetActionQueryFromString(r.URL.RawQuery)
}
func (q ProjectGetActionQuery) Values() url.Values {
	return q.values
}
func (q ProjectGetActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *ProjectGetActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *ProjectGetActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type ProjectGetActionRequest struct {
	Body        interface{}
	Params      ProjectGetActionPathParameter
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
func (x ProjectGetActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x ProjectGetActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func ProjectGetActionClientCreateUrl(
	req ProjectGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := ProjectGetActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = ProjectGetActionPathParameterApply(req.Params, urlAddr)
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
func ProjectGetActionClientExecuteTyped(httpReq *http.Request) (*ProjectGetActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result ProjectGetActionResponse
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
func ProjectGetActionClientBuildRequest(req ProjectGetActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := ProjectGetActionMeta()
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
func ProjectGetActionCall(
	req ProjectGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*ProjectGetActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := ProjectGetActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := ProjectGetActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return ProjectGetActionClientExecuteTyped(r)
}
func ProjectGetActionPathParameterFromGin(g *gin.Context) ProjectGetActionPathParameter {
	return ProjectGetActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// ProjectGetActionRaw registers a raw Gin route for the ProjectGetAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func ProjectGetActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := ProjectGetActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// ProjectGetActionHandler returns the HTTP method, route URL, and a typed Gin handler for the ProjectGetAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func ProjectGetActionHandler(
	handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := ProjectGetActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := ProjectGetActionRequest{
			Body:        nil,
			Params:      ProjectGetActionPathParameterFromGin(m),
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

// ProjectGetActionGin is a high-level convenience wrapper around ProjectGetActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func ProjectGetActionGin(r gin.IRoutes, handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error)) {
	method, url, h := ProjectGetActionHandler(handler)
	r.Handle(method, url, h)
}
func (x ProjectGetActionRequest) IsGin() bool {
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
func ProjectGetActionQueryFromGin(c *gin.Context) ProjectGetActionQuery {
	return ProjectGetActionQueryFromString(c.Request.URL.RawQuery)
}
func GetProjectGetActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func ProjectGetActionPathParameterFromCli(c *cli.Command) ProjectGetActionPathParameter {
	return ProjectGetActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x ProjectGetActionRequest) IsCli() bool {
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

// ProjectGetActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the ProjectGetAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func ProjectGetActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetProjectGetActionPathParameterCliFlags(""))...)
	return flags
}

// ProjectGetActionCliHandler builds a full *cli.Command for the
// ProjectGetAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a ProjectGetActionRequest the same way
// ProjectGetActionHandler (Gin) and ProjectGetActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func ProjectGetActionCliHandler(
	handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error),
) *cli.Command {
	meta := ProjectGetActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: ProjectGetActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := ProjectGetActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Params:      ProjectGetActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// ProjectGetActionCli is a high-level convenience wrapper around
// ProjectGetActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way ProjectGetActionGin
// registers a route on a Gin engine.
func ProjectGetActionCli(
	app *cli.Command,
	handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error),
) {
	app.Commands = append(app.Commands, ProjectGetActionCliHandler(handler))
}

// ProjectGetActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the ProjectGetAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *ProjectGetActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func ProjectGetActionHttpHandler(
	handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := ProjectGetActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := ProjectGetActionRequest{
			Body: nil,
			Params: ProjectGetActionPathParameterFromFn(func(key string) string {
				return r.PathValue(key)
			}),
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

// ProjectGetActionHttp is a high-level convenience wrapper around
// ProjectGetActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func ProjectGetActionHttp(
	mux *http.ServeMux,
	handler func(c ProjectGetActionRequest) (*ProjectGetActionResponse, error),
) {
	method, pattern, h := ProjectGetActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
