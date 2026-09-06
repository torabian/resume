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
* Action to communicate with the action LanguageAwareDeleteAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of LanguageAwareDeleteAction
func LanguageAwareDeleteAction(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error) {
	return &LanguageAwareDeleteActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func LanguageAwareDeleteActionMeta() struct {
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
		Name:        "LanguageAwareDeleteAction",
		CliName:     "delete",
		CliShort:    "d",
		URL:         "/language/delete",
		Method:      "POST",
		Description: `Deletes the given "language" uniqueIds, along with everything languageAwareDeletePreview reports.`,
	}
}

// The base class definition for languageAwareDeleteActionReq
type LanguageAwareDeleteActionReq struct {
	UniqueIds []string `json:"uniqueIds" yaml:"uniqueIds"`
}

func (x *LanguageAwareDeleteActionReq) Json() string {
	if x != nil {
		str, _ := json.MarshalIndent(x, "", "  ")
		return string(str)
	}
	return ""
}
func GetLanguageAwareDeleteActionReqCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name: prefix + "unique-ids",
			Type: "slice",
		},
	}
}
func CastLanguageAwareDeleteActionReqFromCli(c emigo.CliCastable) LanguageAwareDeleteActionReq {
	data := LanguageAwareDeleteActionReq{}
	if c.IsSet("unique-ids") {
		emigo.InflatePossibleSlice(c.String("unique-ids"), &data.UniqueIds)
	}
	return data
}

type LanguageAwareDeleteActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *LanguageAwareDeleteActionResponse) SetContentType(contentType string) *LanguageAwareDeleteActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *LanguageAwareDeleteActionResponse) AsStream(r io.Reader, contentType string) *LanguageAwareDeleteActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *LanguageAwareDeleteActionResponse) AsJSON(payload any) *LanguageAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}
func (x *LanguageAwareDeleteActionResponse) AsHTML(payload string) *LanguageAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *LanguageAwareDeleteActionResponse) AsBytes(payload []byte) *LanguageAwareDeleteActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x LanguageAwareDeleteActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x LanguageAwareDeleteActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x LanguageAwareDeleteActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type LanguageAwareDeleteActionRequestSig = func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error)

/**
 * Query parameters for LanguageAwareDeleteAction
 */
// Query wrapper with private fields
type LanguageAwareDeleteActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func LanguageAwareDeleteActionQueryFromString(rawQuery string) LanguageAwareDeleteActionQuery {
	v := LanguageAwareDeleteActionQuery{}
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
func LanguageAwareDeleteActionQueryFromHttp(r *http.Request) LanguageAwareDeleteActionQuery {
	return LanguageAwareDeleteActionQueryFromString(r.URL.RawQuery)
}
func (q LanguageAwareDeleteActionQuery) Values() url.Values {
	return q.values
}
func (q LanguageAwareDeleteActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *LanguageAwareDeleteActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *LanguageAwareDeleteActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type LanguageAwareDeleteActionRequest struct {
	Body        LanguageAwareDeleteActionReq
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
func (x LanguageAwareDeleteActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x LanguageAwareDeleteActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func LanguageAwareDeleteActionClientCreateUrl(
	req LanguageAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := LanguageAwareDeleteActionMeta()
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
func LanguageAwareDeleteActionClientExecuteTyped(httpReq *http.Request) (*LanguageAwareDeleteActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result LanguageAwareDeleteActionResponse
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
func LanguageAwareDeleteActionClientBuildRequest(req LanguageAwareDeleteActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := LanguageAwareDeleteActionMeta()
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
func LanguageAwareDeleteActionCall(
	req LanguageAwareDeleteActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*LanguageAwareDeleteActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := LanguageAwareDeleteActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := LanguageAwareDeleteActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return LanguageAwareDeleteActionClientExecuteTyped(r)
}

// LanguageAwareDeleteActionRaw registers a raw Gin route for the LanguageAwareDeleteAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func LanguageAwareDeleteActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := LanguageAwareDeleteActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// LanguageAwareDeleteActionHandler returns the HTTP method, route URL, and a typed Gin handler for the LanguageAwareDeleteAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func LanguageAwareDeleteActionHandler(
	handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := LanguageAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body LanguageAwareDeleteActionReq
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := LanguageAwareDeleteActionRequest{
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

// LanguageAwareDeleteActionGin is a high-level convenience wrapper around LanguageAwareDeleteActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func LanguageAwareDeleteActionGin(r gin.IRoutes, handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error)) {
	method, url, h := LanguageAwareDeleteActionHandler(handler)
	r.Handle(method, url, h)
}
func (x LanguageAwareDeleteActionRequest) IsGin() bool {
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
func LanguageAwareDeleteActionQueryFromGin(c *gin.Context) LanguageAwareDeleteActionQuery {
	return LanguageAwareDeleteActionQueryFromString(c.Request.URL.RawQuery)
}
func (x LanguageAwareDeleteActionRequest) IsCli() bool {
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

// LanguageAwareDeleteActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the LanguageAwareDeleteAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func LanguageAwareDeleteActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetLanguageAwareDeleteActionReqCliFlags(""))...)
	return flags
}

// LanguageAwareDeleteActionCliHandler builds a full *cli.Command for the
// LanguageAwareDeleteAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a LanguageAwareDeleteActionRequest the same way
// LanguageAwareDeleteActionHandler (Gin) and LanguageAwareDeleteActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func LanguageAwareDeleteActionCliHandler(
	handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error),
) *cli.Command {
	meta := LanguageAwareDeleteActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: LanguageAwareDeleteActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := LanguageAwareDeleteActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastLanguageAwareDeleteActionReqFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// LanguageAwareDeleteActionCli is a high-level convenience wrapper around
// LanguageAwareDeleteActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way LanguageAwareDeleteActionGin
// registers a route on a Gin engine.
func LanguageAwareDeleteActionCli(
	app *cli.Command,
	handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error),
) {
	app.Commands = append(app.Commands, LanguageAwareDeleteActionCliHandler(handler))
}

// LanguageAwareDeleteActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the LanguageAwareDeleteAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *LanguageAwareDeleteActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func LanguageAwareDeleteActionHttpHandler(
	handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := LanguageAwareDeleteActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body LanguageAwareDeleteActionReq
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := LanguageAwareDeleteActionRequest{
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

// LanguageAwareDeleteActionHttp is a high-level convenience wrapper around
// LanguageAwareDeleteActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func LanguageAwareDeleteActionHttp(
	mux *http.ServeMux,
	handler func(c LanguageAwareDeleteActionRequest) (*LanguageAwareDeleteActionResponse, error),
) {
	method, pattern, h := LanguageAwareDeleteActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
