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
* Action to communicate with the action WorkExperienceCreateAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of WorkExperienceCreateAction
func WorkExperienceCreateAction(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error) {
	return &WorkExperienceCreateActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func WorkExperienceCreateActionMeta() struct {
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
		Name:        "WorkExperienceCreateAction",
		CliName:     "create",
		CliShort:    "c",
		URL:         "/workExperience",
		Method:      "POST",
		Description: `Creates a new "workExperience" row.`,
	}
}

type WorkExperienceCreateActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *WorkExperienceCreateActionResponse) SetContentType(contentType string) *WorkExperienceCreateActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *WorkExperienceCreateActionResponse) AsStream(r io.Reader, contentType string) *WorkExperienceCreateActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *WorkExperienceCreateActionResponse) AsJSON(payload any) *WorkExperienceCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *WorkExperienceCreateActionResponse) WithIdeal(payload WorkExperienceDto) *WorkExperienceCreateActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *WorkExperienceCreateActionResponse) AsIdeal() (*WorkExperienceDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res WorkExperienceDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *WorkExperienceCreateActionResponse) AsHTML(payload string) *WorkExperienceCreateActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *WorkExperienceCreateActionResponse) AsBytes(payload []byte) *WorkExperienceCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x WorkExperienceCreateActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x WorkExperienceCreateActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x WorkExperienceCreateActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type WorkExperienceCreateActionRequestSig = func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error)

/**
 * Query parameters for WorkExperienceCreateAction
 */
// Query wrapper with private fields
type WorkExperienceCreateActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func WorkExperienceCreateActionQueryFromString(rawQuery string) WorkExperienceCreateActionQuery {
	v := WorkExperienceCreateActionQuery{}
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
func WorkExperienceCreateActionQueryFromHttp(r *http.Request) WorkExperienceCreateActionQuery {
	return WorkExperienceCreateActionQueryFromString(r.URL.RawQuery)
}
func (q WorkExperienceCreateActionQuery) Values() url.Values {
	return q.values
}
func (q WorkExperienceCreateActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *WorkExperienceCreateActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *WorkExperienceCreateActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type WorkExperienceCreateActionRequest struct {
	Body        WorkExperienceDto
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
func (x WorkExperienceCreateActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x WorkExperienceCreateActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func WorkExperienceCreateActionClientCreateUrl(
	req WorkExperienceCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := WorkExperienceCreateActionMeta()
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
func WorkExperienceCreateActionClientExecuteTyped(httpReq *http.Request) (*WorkExperienceCreateActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result WorkExperienceCreateActionResponse
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
func WorkExperienceCreateActionClientBuildRequest(req WorkExperienceCreateActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := WorkExperienceCreateActionMeta()
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
func WorkExperienceCreateActionCall(
	req WorkExperienceCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*WorkExperienceCreateActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := WorkExperienceCreateActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := WorkExperienceCreateActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return WorkExperienceCreateActionClientExecuteTyped(r)
}

// WorkExperienceCreateActionRaw registers a raw Gin route for the WorkExperienceCreateAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func WorkExperienceCreateActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := WorkExperienceCreateActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// WorkExperienceCreateActionHandler returns the HTTP method, route URL, and a typed Gin handler for the WorkExperienceCreateAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func WorkExperienceCreateActionHandler(
	handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := WorkExperienceCreateActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body WorkExperienceDto
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := WorkExperienceCreateActionRequest{
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

// WorkExperienceCreateActionGin is a high-level convenience wrapper around WorkExperienceCreateActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func WorkExperienceCreateActionGin(r gin.IRoutes, handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error)) {
	method, url, h := WorkExperienceCreateActionHandler(handler)
	r.Handle(method, url, h)
}
func (x WorkExperienceCreateActionRequest) IsGin() bool {
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
func WorkExperienceCreateActionQueryFromGin(c *gin.Context) WorkExperienceCreateActionQuery {
	return WorkExperienceCreateActionQueryFromString(c.Request.URL.RawQuery)
}
func (x WorkExperienceCreateActionRequest) IsCli() bool {
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

// WorkExperienceCreateActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the WorkExperienceCreateAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func WorkExperienceCreateActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetWorkExperienceDtoCliFlags(""))...)
	return flags
}

// WorkExperienceCreateActionCliHandler builds a full *cli.Command for the
// WorkExperienceCreateAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a WorkExperienceCreateActionRequest the same way
// WorkExperienceCreateActionHandler (Gin) and WorkExperienceCreateActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func WorkExperienceCreateActionCliHandler(
	handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error),
) *cli.Command {
	meta := WorkExperienceCreateActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: WorkExperienceCreateActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := WorkExperienceCreateActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastWorkExperienceDtoFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// WorkExperienceCreateActionCli is a high-level convenience wrapper around
// WorkExperienceCreateActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way WorkExperienceCreateActionGin
// registers a route on a Gin engine.
func WorkExperienceCreateActionCli(
	app *cli.Command,
	handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error),
) {
	app.Commands = append(app.Commands, WorkExperienceCreateActionCliHandler(handler))
}

// WorkExperienceCreateActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the WorkExperienceCreateAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *WorkExperienceCreateActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func WorkExperienceCreateActionHttpHandler(
	handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := WorkExperienceCreateActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body WorkExperienceDto
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := WorkExperienceCreateActionRequest{
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

// WorkExperienceCreateActionHttp is a high-level convenience wrapper around
// WorkExperienceCreateActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func WorkExperienceCreateActionHttp(
	mux *http.ServeMux,
	handler func(c WorkExperienceCreateActionRequest) (*WorkExperienceCreateActionResponse, error),
) {
	method, pattern, h := WorkExperienceCreateActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
