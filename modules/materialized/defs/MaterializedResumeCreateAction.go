package materializeddefs

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
* Action to communicate with the action MaterializedResumeCreateAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of MaterializedResumeCreateAction
func MaterializedResumeCreateAction(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error) {
	return &MaterializedResumeCreateActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func MaterializedResumeCreateActionMeta() struct {
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
		Name:        "MaterializedResumeCreateAction",
		CliName:     "create",
		CliShort:    "c",
		URL:         "/materializedResume",
		Method:      "POST",
		Description: `Creates a new "materializedResume" row.`,
	}
}

type MaterializedResumeCreateActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *MaterializedResumeCreateActionResponse) SetContentType(contentType string) *MaterializedResumeCreateActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *MaterializedResumeCreateActionResponse) AsStream(r io.Reader, contentType string) *MaterializedResumeCreateActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *MaterializedResumeCreateActionResponse) AsJSON(payload any) *MaterializedResumeCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *MaterializedResumeCreateActionResponse) WithIdeal(payload MaterializedResumeDto) *MaterializedResumeCreateActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *MaterializedResumeCreateActionResponse) AsIdeal() (*MaterializedResumeDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res MaterializedResumeDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *MaterializedResumeCreateActionResponse) AsHTML(payload string) *MaterializedResumeCreateActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *MaterializedResumeCreateActionResponse) AsBytes(payload []byte) *MaterializedResumeCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x MaterializedResumeCreateActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x MaterializedResumeCreateActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x MaterializedResumeCreateActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type MaterializedResumeCreateActionRequestSig = func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error)

/**
 * Query parameters for MaterializedResumeCreateAction
 */
// Query wrapper with private fields
type MaterializedResumeCreateActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func MaterializedResumeCreateActionQueryFromString(rawQuery string) MaterializedResumeCreateActionQuery {
	v := MaterializedResumeCreateActionQuery{}
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
func MaterializedResumeCreateActionQueryFromHttp(r *http.Request) MaterializedResumeCreateActionQuery {
	return MaterializedResumeCreateActionQueryFromString(r.URL.RawQuery)
}
func (q MaterializedResumeCreateActionQuery) Values() url.Values {
	return q.values
}
func (q MaterializedResumeCreateActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *MaterializedResumeCreateActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *MaterializedResumeCreateActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type MaterializedResumeCreateActionRequest struct {
	Body        MaterializedResumeDto
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
func (x MaterializedResumeCreateActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x MaterializedResumeCreateActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func MaterializedResumeCreateActionClientCreateUrl(
	req MaterializedResumeCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := MaterializedResumeCreateActionMeta()
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
func MaterializedResumeCreateActionClientExecuteTyped(httpReq *http.Request) (*MaterializedResumeCreateActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result MaterializedResumeCreateActionResponse
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
func MaterializedResumeCreateActionClientBuildRequest(req MaterializedResumeCreateActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := MaterializedResumeCreateActionMeta()
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
func MaterializedResumeCreateActionCall(
	req MaterializedResumeCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*MaterializedResumeCreateActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := MaterializedResumeCreateActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := MaterializedResumeCreateActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return MaterializedResumeCreateActionClientExecuteTyped(r)
}

// MaterializedResumeCreateActionRaw registers a raw Gin route for the MaterializedResumeCreateAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func MaterializedResumeCreateActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := MaterializedResumeCreateActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// MaterializedResumeCreateActionHandler returns the HTTP method, route URL, and a typed Gin handler for the MaterializedResumeCreateAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func MaterializedResumeCreateActionHandler(
	handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := MaterializedResumeCreateActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body MaterializedResumeDto
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := MaterializedResumeCreateActionRequest{
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

// MaterializedResumeCreateActionGin is a high-level convenience wrapper around MaterializedResumeCreateActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func MaterializedResumeCreateActionGin(r gin.IRoutes, handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error)) {
	method, url, h := MaterializedResumeCreateActionHandler(handler)
	r.Handle(method, url, h)
}
func (x MaterializedResumeCreateActionRequest) IsGin() bool {
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
func MaterializedResumeCreateActionQueryFromGin(c *gin.Context) MaterializedResumeCreateActionQuery {
	return MaterializedResumeCreateActionQueryFromString(c.Request.URL.RawQuery)
}
func (x MaterializedResumeCreateActionRequest) IsCli() bool {
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

// MaterializedResumeCreateActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the MaterializedResumeCreateAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func MaterializedResumeCreateActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetMaterializedResumeDtoCliFlags(""))...)
	return flags
}

// MaterializedResumeCreateActionCliHandler builds a full *cli.Command for the
// MaterializedResumeCreateAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a MaterializedResumeCreateActionRequest the same way
// MaterializedResumeCreateActionHandler (Gin) and MaterializedResumeCreateActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func MaterializedResumeCreateActionCliHandler(
	handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error),
) *cli.Command {
	meta := MaterializedResumeCreateActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: MaterializedResumeCreateActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := MaterializedResumeCreateActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastMaterializedResumeDtoFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// MaterializedResumeCreateActionCli is a high-level convenience wrapper around
// MaterializedResumeCreateActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way MaterializedResumeCreateActionGin
// registers a route on a Gin engine.
func MaterializedResumeCreateActionCli(
	app *cli.Command,
	handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error),
) {
	app.Commands = append(app.Commands, MaterializedResumeCreateActionCliHandler(handler))
}

// MaterializedResumeCreateActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the MaterializedResumeCreateAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *MaterializedResumeCreateActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func MaterializedResumeCreateActionHttpHandler(
	handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := MaterializedResumeCreateActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body MaterializedResumeDto
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := MaterializedResumeCreateActionRequest{
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

// MaterializedResumeCreateActionHttp is a high-level convenience wrapper around
// MaterializedResumeCreateActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func MaterializedResumeCreateActionHttp(
	mux *http.ServeMux,
	handler func(c MaterializedResumeCreateActionRequest) (*MaterializedResumeCreateActionResponse, error),
) {
	method, pattern, h := MaterializedResumeCreateActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
