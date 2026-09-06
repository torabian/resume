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
* Action to communicate with the action ResumeAwareDeleteAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of ResumeAwareDeleteAction
func ResumeAwareDeleteAction(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error) {
	return &ResumeAwareDeleteActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func ResumeAwareDeleteActionMeta() struct {
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
		Name:        "ResumeAwareDeleteAction",
		CliName:     "delete",
		CliShort:    "d",
		URL:         "/resume/delete",
		Method:      "POST",
		Description: `Deletes the given "resume" uniqueIds, along with everything resumeAwareDeletePreview reports.`,
	}
}

// The base class definition for resumeAwareDeleteActionReq
type ResumeAwareDeleteActionReq struct {
	UniqueIds []string `json:"uniqueIds" yaml:"uniqueIds"`
}

func (x *ResumeAwareDeleteActionReq) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetResumeAwareDeleteActionReqCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-ids",
			Type: "slice",
		},
	}
}
func CastResumeAwareDeleteActionReqFromCli(c emigo.CliCastable) ResumeAwareDeleteActionReq {
	data := ResumeAwareDeleteActionReq{}
	if c.IsSet("unique-ids") {
		emigo.InflatePossibleSlice(c.String("unique-ids"), &data.UniqueIds)
	}
	return data
}

type ResumeAwareDeleteActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *ResumeAwareDeleteActionResponse) SetContentType(contentType string) *ResumeAwareDeleteActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *ResumeAwareDeleteActionResponse) AsStream(r io.Reader, contentType string) *ResumeAwareDeleteActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *ResumeAwareDeleteActionResponse) AsJSON(payload any) *ResumeAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}
func (x *ResumeAwareDeleteActionResponse) AsHTML(payload string) *ResumeAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *ResumeAwareDeleteActionResponse) AsBytes(payload []byte) *ResumeAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x ResumeAwareDeleteActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x ResumeAwareDeleteActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x ResumeAwareDeleteActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type ResumeAwareDeleteActionRequestSig = func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error)

/**
 * Query parameters for ResumeAwareDeleteAction
 */
// Query wrapper with private fields
type ResumeAwareDeleteActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func ResumeAwareDeleteActionQueryFromString(rawQuery string) ResumeAwareDeleteActionQuery {
	v := ResumeAwareDeleteActionQuery{}
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
func ResumeAwareDeleteActionQueryFromHttp(r *http.Request) ResumeAwareDeleteActionQuery {
	return ResumeAwareDeleteActionQueryFromString(r.URL.RawQuery)
}
func (q ResumeAwareDeleteActionQuery) Values() url.Values {
	return q.values
}
func (q ResumeAwareDeleteActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *ResumeAwareDeleteActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *ResumeAwareDeleteActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type ResumeAwareDeleteActionRequest struct {
	Body        ResumeAwareDeleteActionReq
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
func (x ResumeAwareDeleteActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x ResumeAwareDeleteActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func ResumeAwareDeleteActionClientCreateUrl(
	req ResumeAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := ResumeAwareDeleteActionMeta()
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
func ResumeAwareDeleteActionClientExecuteTyped(httpReq *http.Request) (*ResumeAwareDeleteActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result ResumeAwareDeleteActionResponse
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
func ResumeAwareDeleteActionClientBuildRequest(req ResumeAwareDeleteActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := ResumeAwareDeleteActionMeta()
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
func ResumeAwareDeleteActionCall(
	req ResumeAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*ResumeAwareDeleteActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := ResumeAwareDeleteActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := ResumeAwareDeleteActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return ResumeAwareDeleteActionClientExecuteTyped(r)
}

// ResumeAwareDeleteActionRaw registers a raw Gin route for the ResumeAwareDeleteAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func ResumeAwareDeleteActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := ResumeAwareDeleteActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// ResumeAwareDeleteActionHandler returns the HTTP method, route URL, and a typed Gin handler for the ResumeAwareDeleteAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func ResumeAwareDeleteActionHandler(
	handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := ResumeAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body ResumeAwareDeleteActionReq
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := ResumeAwareDeleteActionRequest{
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

// ResumeAwareDeleteActionGin is a high-level convenience wrapper around ResumeAwareDeleteActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func ResumeAwareDeleteActionGin(r gin.IRoutes, handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error)) {
	method, url, h := ResumeAwareDeleteActionHandler(handler)
	r.Handle(method, url, h)
}
func (x ResumeAwareDeleteActionRequest) IsGin() bool {
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
func ResumeAwareDeleteActionQueryFromGin(c *gin.Context) ResumeAwareDeleteActionQuery {
	return ResumeAwareDeleteActionQueryFromString(c.Request.URL.RawQuery)
}
func (x ResumeAwareDeleteActionRequest) IsCli() bool {
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

// ResumeAwareDeleteActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the ResumeAwareDeleteAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func ResumeAwareDeleteActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetResumeAwareDeleteActionReqCliFlags(""))...)
	return flags
}

// ResumeAwareDeleteActionCliHandler builds a full *cli.Command for the
// ResumeAwareDeleteAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a ResumeAwareDeleteActionRequest the same way
// ResumeAwareDeleteActionHandler (Gin) and ResumeAwareDeleteActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func ResumeAwareDeleteActionCliHandler(
	handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error),
) *cli.Command {
	meta := ResumeAwareDeleteActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: ResumeAwareDeleteActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := ResumeAwareDeleteActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastResumeAwareDeleteActionReqFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// ResumeAwareDeleteActionCli is a high-level convenience wrapper around
// ResumeAwareDeleteActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way ResumeAwareDeleteActionGin
// registers a route on a Gin engine.
func ResumeAwareDeleteActionCli(
	app *cli.Command,
	handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error),
) {
	app.Commands = append(app.Commands, ResumeAwareDeleteActionCliHandler(handler))
}

// ResumeAwareDeleteActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the ResumeAwareDeleteAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *ResumeAwareDeleteActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func ResumeAwareDeleteActionHttpHandler(
	handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := ResumeAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body ResumeAwareDeleteActionReq
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := ResumeAwareDeleteActionRequest{
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

// ResumeAwareDeleteActionHttp is a high-level convenience wrapper around
// ResumeAwareDeleteActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func ResumeAwareDeleteActionHttp(
	mux *http.ServeMux,
	handler func(c ResumeAwareDeleteActionRequest) (*ResumeAwareDeleteActionResponse, error),
) {
	method, pattern, h := ResumeAwareDeleteActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
