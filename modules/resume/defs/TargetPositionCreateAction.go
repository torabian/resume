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
* Action to communicate with the action TargetPositionCreateAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of TargetPositionCreateAction
func TargetPositionCreateAction(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error) {
	return &TargetPositionCreateActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func TargetPositionCreateActionMeta() struct {
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
		Name:        "TargetPositionCreateAction",
		CliName:     "create",
		CliShort:    "c",
		URL:         "/targetPosition",
		Method:      "POST",
		Description: `Creates a new "targetPosition" row.`,
	}
}

type TargetPositionCreateActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *TargetPositionCreateActionResponse) SetContentType(contentType string) *TargetPositionCreateActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *TargetPositionCreateActionResponse) AsStream(r io.Reader, contentType string) *TargetPositionCreateActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *TargetPositionCreateActionResponse) AsJSON(payload any) *TargetPositionCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *TargetPositionCreateActionResponse) WithIdeal(payload TargetPositionDto) *TargetPositionCreateActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *TargetPositionCreateActionResponse) AsIdeal() (*TargetPositionDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res TargetPositionDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *TargetPositionCreateActionResponse) AsHTML(payload string) *TargetPositionCreateActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *TargetPositionCreateActionResponse) AsBytes(payload []byte) *TargetPositionCreateActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x TargetPositionCreateActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x TargetPositionCreateActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x TargetPositionCreateActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type TargetPositionCreateActionRequestSig = func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error)

/**
 * Query parameters for TargetPositionCreateAction
 */
// Query wrapper with private fields
type TargetPositionCreateActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func TargetPositionCreateActionQueryFromString(rawQuery string) TargetPositionCreateActionQuery {
	v := TargetPositionCreateActionQuery{}
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
func TargetPositionCreateActionQueryFromHttp(r *http.Request) TargetPositionCreateActionQuery {
	return TargetPositionCreateActionQueryFromString(r.URL.RawQuery)
}
func (q TargetPositionCreateActionQuery) Values() url.Values {
	return q.values
}
func (q TargetPositionCreateActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *TargetPositionCreateActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *TargetPositionCreateActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type TargetPositionCreateActionRequest struct {
	Body        TargetPositionDto
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
func (x TargetPositionCreateActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x TargetPositionCreateActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func TargetPositionCreateActionClientCreateUrl(
	req TargetPositionCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := TargetPositionCreateActionMeta()
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
func TargetPositionCreateActionClientExecuteTyped(httpReq *http.Request) (*TargetPositionCreateActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result TargetPositionCreateActionResponse
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
func TargetPositionCreateActionClientBuildRequest(req TargetPositionCreateActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := TargetPositionCreateActionMeta()
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
func TargetPositionCreateActionCall(
	req TargetPositionCreateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*TargetPositionCreateActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := TargetPositionCreateActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := TargetPositionCreateActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return TargetPositionCreateActionClientExecuteTyped(r)
}

// TargetPositionCreateActionRaw registers a raw Gin route for the TargetPositionCreateAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func TargetPositionCreateActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := TargetPositionCreateActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// TargetPositionCreateActionHandler returns the HTTP method, route URL, and a typed Gin handler for the TargetPositionCreateAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func TargetPositionCreateActionHandler(
	handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := TargetPositionCreateActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body TargetPositionDto
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := TargetPositionCreateActionRequest{
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

// TargetPositionCreateActionGin is a high-level convenience wrapper around TargetPositionCreateActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func TargetPositionCreateActionGin(r gin.IRoutes, handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error)) {
	method, url, h := TargetPositionCreateActionHandler(handler)
	r.Handle(method, url, h)
}
func (x TargetPositionCreateActionRequest) IsGin() bool {
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
func TargetPositionCreateActionQueryFromGin(c *gin.Context) TargetPositionCreateActionQuery {
	return TargetPositionCreateActionQueryFromString(c.Request.URL.RawQuery)
}
func (x TargetPositionCreateActionRequest) IsCli() bool {
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

// TargetPositionCreateActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the TargetPositionCreateAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func TargetPositionCreateActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetTargetPositionDtoCliFlags(""))...)
	return flags
}

// TargetPositionCreateActionCliHandler builds a full *cli.Command for the
// TargetPositionCreateAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a TargetPositionCreateActionRequest the same way
// TargetPositionCreateActionHandler (Gin) and TargetPositionCreateActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func TargetPositionCreateActionCliHandler(
	handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error),
) *cli.Command {
	meta := TargetPositionCreateActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: TargetPositionCreateActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := TargetPositionCreateActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastTargetPositionDtoFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// TargetPositionCreateActionCli is a high-level convenience wrapper around
// TargetPositionCreateActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way TargetPositionCreateActionGin
// registers a route on a Gin engine.
func TargetPositionCreateActionCli(
	app *cli.Command,
	handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error),
) {
	app.Commands = append(app.Commands, TargetPositionCreateActionCliHandler(handler))
}

// TargetPositionCreateActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the TargetPositionCreateAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *TargetPositionCreateActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func TargetPositionCreateActionHttpHandler(
	handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := TargetPositionCreateActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body TargetPositionDto
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := TargetPositionCreateActionRequest{
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

// TargetPositionCreateActionHttp is a high-level convenience wrapper around
// TargetPositionCreateActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func TargetPositionCreateActionHttp(
	mux *http.ServeMux,
	handler func(c TargetPositionCreateActionRequest) (*TargetPositionCreateActionResponse, error),
) {
	method, pattern, h := TargetPositionCreateActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
