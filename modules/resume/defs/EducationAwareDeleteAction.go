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
* Action to communicate with the action EducationAwareDeleteAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of EducationAwareDeleteAction
func EducationAwareDeleteAction(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error) {
	return &EducationAwareDeleteActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func EducationAwareDeleteActionMeta() struct {
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
		Name:        "EducationAwareDeleteAction",
		CliName:     "delete",
		CliShort:    "d",
		URL:         "/education/delete",
		Method:      "POST",
		Description: `Deletes the given "education" uniqueIds, along with everything educationAwareDeletePreview reports.`,
	}
}

// The base class definition for educationAwareDeleteActionReq
type EducationAwareDeleteActionReq struct {
	UniqueIds []string `json:"uniqueIds" yaml:"uniqueIds"`
}

func (x *EducationAwareDeleteActionReq) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetEducationAwareDeleteActionReqCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-ids",
			Type: "slice",
		},
	}
}
func CastEducationAwareDeleteActionReqFromCli(c emigo.CliCastable) EducationAwareDeleteActionReq {
	data := EducationAwareDeleteActionReq{}
	if c.IsSet("unique-ids") {
		emigo.InflatePossibleSlice(c.String("unique-ids"), &data.UniqueIds)
	}
	return data
}

type EducationAwareDeleteActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *EducationAwareDeleteActionResponse) SetContentType(contentType string) *EducationAwareDeleteActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *EducationAwareDeleteActionResponse) AsStream(r io.Reader, contentType string) *EducationAwareDeleteActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *EducationAwareDeleteActionResponse) AsJSON(payload any) *EducationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}
func (x *EducationAwareDeleteActionResponse) AsHTML(payload string) *EducationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *EducationAwareDeleteActionResponse) AsBytes(payload []byte) *EducationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x EducationAwareDeleteActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x EducationAwareDeleteActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x EducationAwareDeleteActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type EducationAwareDeleteActionRequestSig = func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error)

/**
 * Query parameters for EducationAwareDeleteAction
 */
// Query wrapper with private fields
type EducationAwareDeleteActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func EducationAwareDeleteActionQueryFromString(rawQuery string) EducationAwareDeleteActionQuery {
	v := EducationAwareDeleteActionQuery{}
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
func EducationAwareDeleteActionQueryFromHttp(r *http.Request) EducationAwareDeleteActionQuery {
	return EducationAwareDeleteActionQueryFromString(r.URL.RawQuery)
}
func (q EducationAwareDeleteActionQuery) Values() url.Values {
	return q.values
}
func (q EducationAwareDeleteActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *EducationAwareDeleteActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *EducationAwareDeleteActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type EducationAwareDeleteActionRequest struct {
	Body        EducationAwareDeleteActionReq
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
func (x EducationAwareDeleteActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x EducationAwareDeleteActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func EducationAwareDeleteActionClientCreateUrl(
	req EducationAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := EducationAwareDeleteActionMeta()
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
func EducationAwareDeleteActionClientExecuteTyped(httpReq *http.Request) (*EducationAwareDeleteActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result EducationAwareDeleteActionResponse
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
func EducationAwareDeleteActionClientBuildRequest(req EducationAwareDeleteActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := EducationAwareDeleteActionMeta()
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
func EducationAwareDeleteActionCall(
	req EducationAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*EducationAwareDeleteActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := EducationAwareDeleteActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := EducationAwareDeleteActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return EducationAwareDeleteActionClientExecuteTyped(r)
}

// EducationAwareDeleteActionRaw registers a raw Gin route for the EducationAwareDeleteAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func EducationAwareDeleteActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := EducationAwareDeleteActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// EducationAwareDeleteActionHandler returns the HTTP method, route URL, and a typed Gin handler for the EducationAwareDeleteAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func EducationAwareDeleteActionHandler(
	handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := EducationAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body EducationAwareDeleteActionReq
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := EducationAwareDeleteActionRequest{
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

// EducationAwareDeleteActionGin is a high-level convenience wrapper around EducationAwareDeleteActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func EducationAwareDeleteActionGin(r gin.IRoutes, handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error)) {
	method, url, h := EducationAwareDeleteActionHandler(handler)
	r.Handle(method, url, h)
}
func (x EducationAwareDeleteActionRequest) IsGin() bool {
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
func EducationAwareDeleteActionQueryFromGin(c *gin.Context) EducationAwareDeleteActionQuery {
	return EducationAwareDeleteActionQueryFromString(c.Request.URL.RawQuery)
}
func (x EducationAwareDeleteActionRequest) IsCli() bool {
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

// EducationAwareDeleteActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the EducationAwareDeleteAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func EducationAwareDeleteActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetEducationAwareDeleteActionReqCliFlags(""))...)
	return flags
}

// EducationAwareDeleteActionCliHandler builds a full *cli.Command for the
// EducationAwareDeleteAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a EducationAwareDeleteActionRequest the same way
// EducationAwareDeleteActionHandler (Gin) and EducationAwareDeleteActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func EducationAwareDeleteActionCliHandler(
	handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error),
) *cli.Command {
	meta := EducationAwareDeleteActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: EducationAwareDeleteActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := EducationAwareDeleteActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastEducationAwareDeleteActionReqFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// EducationAwareDeleteActionCli is a high-level convenience wrapper around
// EducationAwareDeleteActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way EducationAwareDeleteActionGin
// registers a route on a Gin engine.
func EducationAwareDeleteActionCli(
	app *cli.Command,
	handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error),
) {
	app.Commands = append(app.Commands, EducationAwareDeleteActionCliHandler(handler))
}

// EducationAwareDeleteActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the EducationAwareDeleteAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *EducationAwareDeleteActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func EducationAwareDeleteActionHttpHandler(
	handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := EducationAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body EducationAwareDeleteActionReq
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := EducationAwareDeleteActionRequest{
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

// EducationAwareDeleteActionHttp is a high-level convenience wrapper around
// EducationAwareDeleteActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func EducationAwareDeleteActionHttp(
	mux *http.ServeMux,
	handler func(c EducationAwareDeleteActionRequest) (*EducationAwareDeleteActionResponse, error),
) {
	method, pattern, h := EducationAwareDeleteActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
