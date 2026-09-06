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
* Action to communicate with the action CertificationAwareDeleteAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of CertificationAwareDeleteAction
func CertificationAwareDeleteAction(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error) {
	return &CertificationAwareDeleteActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func CertificationAwareDeleteActionMeta() struct {
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
		Name:        "CertificationAwareDeleteAction",
		CliName:     "delete",
		CliShort:    "d",
		URL:         "/certification/delete",
		Method:      "POST",
		Description: `Deletes the given "certification" uniqueIds, along with everything certificationAwareDeletePreview reports.`,
	}
}

// The base class definition for certificationAwareDeleteActionReq
type CertificationAwareDeleteActionReq struct {
	UniqueIds []string `json:"uniqueIds" yaml:"uniqueIds"`
}

func (x *CertificationAwareDeleteActionReq) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetCertificationAwareDeleteActionReqCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-ids",
			Type: "slice",
		},
	}
}
func CastCertificationAwareDeleteActionReqFromCli(c emigo.CliCastable) CertificationAwareDeleteActionReq {
	data := CertificationAwareDeleteActionReq{}
	if c.IsSet("unique-ids") {
		emigo.InflatePossibleSlice(c.String("unique-ids"), &data.UniqueIds)
	}
	return data
}

type CertificationAwareDeleteActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *CertificationAwareDeleteActionResponse) SetContentType(contentType string) *CertificationAwareDeleteActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *CertificationAwareDeleteActionResponse) AsStream(r io.Reader, contentType string) *CertificationAwareDeleteActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *CertificationAwareDeleteActionResponse) AsJSON(payload any) *CertificationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}
func (x *CertificationAwareDeleteActionResponse) AsHTML(payload string) *CertificationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *CertificationAwareDeleteActionResponse) AsBytes(payload []byte) *CertificationAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x CertificationAwareDeleteActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x CertificationAwareDeleteActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x CertificationAwareDeleteActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type CertificationAwareDeleteActionRequestSig = func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error)

/**
 * Query parameters for CertificationAwareDeleteAction
 */
// Query wrapper with private fields
type CertificationAwareDeleteActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func CertificationAwareDeleteActionQueryFromString(rawQuery string) CertificationAwareDeleteActionQuery {
	v := CertificationAwareDeleteActionQuery{}
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
func CertificationAwareDeleteActionQueryFromHttp(r *http.Request) CertificationAwareDeleteActionQuery {
	return CertificationAwareDeleteActionQueryFromString(r.URL.RawQuery)
}
func (q CertificationAwareDeleteActionQuery) Values() url.Values {
	return q.values
}
func (q CertificationAwareDeleteActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *CertificationAwareDeleteActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *CertificationAwareDeleteActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type CertificationAwareDeleteActionRequest struct {
	Body        CertificationAwareDeleteActionReq
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
func (x CertificationAwareDeleteActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x CertificationAwareDeleteActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func CertificationAwareDeleteActionClientCreateUrl(
	req CertificationAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := CertificationAwareDeleteActionMeta()
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
func CertificationAwareDeleteActionClientExecuteTyped(httpReq *http.Request) (*CertificationAwareDeleteActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result CertificationAwareDeleteActionResponse
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
func CertificationAwareDeleteActionClientBuildRequest(req CertificationAwareDeleteActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := CertificationAwareDeleteActionMeta()
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
func CertificationAwareDeleteActionCall(
	req CertificationAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*CertificationAwareDeleteActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := CertificationAwareDeleteActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := CertificationAwareDeleteActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return CertificationAwareDeleteActionClientExecuteTyped(r)
}

// CertificationAwareDeleteActionRaw registers a raw Gin route for the CertificationAwareDeleteAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func CertificationAwareDeleteActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := CertificationAwareDeleteActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// CertificationAwareDeleteActionHandler returns the HTTP method, route URL, and a typed Gin handler for the CertificationAwareDeleteAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func CertificationAwareDeleteActionHandler(
	handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := CertificationAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body CertificationAwareDeleteActionReq
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := CertificationAwareDeleteActionRequest{
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

// CertificationAwareDeleteActionGin is a high-level convenience wrapper around CertificationAwareDeleteActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func CertificationAwareDeleteActionGin(r gin.IRoutes, handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error)) {
	method, url, h := CertificationAwareDeleteActionHandler(handler)
	r.Handle(method, url, h)
}
func (x CertificationAwareDeleteActionRequest) IsGin() bool {
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
func CertificationAwareDeleteActionQueryFromGin(c *gin.Context) CertificationAwareDeleteActionQuery {
	return CertificationAwareDeleteActionQueryFromString(c.Request.URL.RawQuery)
}
func (x CertificationAwareDeleteActionRequest) IsCli() bool {
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

// CertificationAwareDeleteActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the CertificationAwareDeleteAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func CertificationAwareDeleteActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetCertificationAwareDeleteActionReqCliFlags(""))...)
	return flags
}

// CertificationAwareDeleteActionCliHandler builds a full *cli.Command for the
// CertificationAwareDeleteAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a CertificationAwareDeleteActionRequest the same way
// CertificationAwareDeleteActionHandler (Gin) and CertificationAwareDeleteActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func CertificationAwareDeleteActionCliHandler(
	handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error),
) *cli.Command {
	meta := CertificationAwareDeleteActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: CertificationAwareDeleteActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := CertificationAwareDeleteActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastCertificationAwareDeleteActionReqFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// CertificationAwareDeleteActionCli is a high-level convenience wrapper around
// CertificationAwareDeleteActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way CertificationAwareDeleteActionGin
// registers a route on a Gin engine.
func CertificationAwareDeleteActionCli(
	app *cli.Command,
	handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error),
) {
	app.Commands = append(app.Commands, CertificationAwareDeleteActionCliHandler(handler))
}

// CertificationAwareDeleteActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the CertificationAwareDeleteAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *CertificationAwareDeleteActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func CertificationAwareDeleteActionHttpHandler(
	handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := CertificationAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body CertificationAwareDeleteActionReq
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := CertificationAwareDeleteActionRequest{
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

// CertificationAwareDeleteActionHttp is a high-level convenience wrapper around
// CertificationAwareDeleteActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func CertificationAwareDeleteActionHttp(
	mux *http.ServeMux,
	handler func(c CertificationAwareDeleteActionRequest) (*CertificationAwareDeleteActionResponse, error),
) {
	method, pattern, h := CertificationAwareDeleteActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
