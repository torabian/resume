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
* Action to communicate with the action TargetPositionGetAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of TargetPositionGetAction
func TargetPositionGetAction(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error) {
	return &TargetPositionGetActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func TargetPositionGetActionMeta() struct {
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
		Name:        "TargetPositionGetAction",
		CliName:     "get",
		CliShort:    "g",
		URL:         "/targetPosition/:uniqueId",
		Method:      "GET",
		Description: `Looks up a single "targetPosition" row by uniqueId.`,
	}
}

type TargetPositionGetActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *TargetPositionGetActionResponse) SetContentType(contentType string) *TargetPositionGetActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *TargetPositionGetActionResponse) AsStream(r io.Reader, contentType string) *TargetPositionGetActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *TargetPositionGetActionResponse) AsJSON(payload any) *TargetPositionGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *TargetPositionGetActionResponse) WithIdeal(payload TargetPositionDto) *TargetPositionGetActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *TargetPositionGetActionResponse) AsIdeal() (*TargetPositionDto, error) {
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
func (x *TargetPositionGetActionResponse) AsHTML(payload string) *TargetPositionGetActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *TargetPositionGetActionResponse) AsBytes(payload []byte) *TargetPositionGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x TargetPositionGetActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x TargetPositionGetActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x TargetPositionGetActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type TargetPositionGetActionRequestSig = func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error)

/**
 * Path parameters for TargetPositionGetAction
 */
type TargetPositionGetActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func TargetPositionGetActionPathParameterApply(params TargetPositionGetActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func TargetPositionGetActionPathParameterFromFn(fn func(key string) string) TargetPositionGetActionPathParameter {
	res := TargetPositionGetActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for TargetPositionGetAction
 */
// Query wrapper with private fields
type TargetPositionGetActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func TargetPositionGetActionQueryFromString(rawQuery string) TargetPositionGetActionQuery {
	v := TargetPositionGetActionQuery{}
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
func TargetPositionGetActionQueryFromHttp(r *http.Request) TargetPositionGetActionQuery {
	return TargetPositionGetActionQueryFromString(r.URL.RawQuery)
}
func (q TargetPositionGetActionQuery) Values() url.Values {
	return q.values
}
func (q TargetPositionGetActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *TargetPositionGetActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *TargetPositionGetActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type TargetPositionGetActionRequest struct {
	Body        interface{}
	Params      TargetPositionGetActionPathParameter
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
func (x TargetPositionGetActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x TargetPositionGetActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func TargetPositionGetActionClientCreateUrl(
	req TargetPositionGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := TargetPositionGetActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = TargetPositionGetActionPathParameterApply(req.Params, urlAddr)
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
func TargetPositionGetActionClientExecuteTyped(httpReq *http.Request) (*TargetPositionGetActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result TargetPositionGetActionResponse
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
func TargetPositionGetActionClientBuildRequest(req TargetPositionGetActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := TargetPositionGetActionMeta()
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
func TargetPositionGetActionCall(
	req TargetPositionGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*TargetPositionGetActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := TargetPositionGetActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := TargetPositionGetActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return TargetPositionGetActionClientExecuteTyped(r)
}
func TargetPositionGetActionPathParameterFromGin(g *gin.Context) TargetPositionGetActionPathParameter {
	return TargetPositionGetActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// TargetPositionGetActionRaw registers a raw Gin route for the TargetPositionGetAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func TargetPositionGetActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := TargetPositionGetActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// TargetPositionGetActionHandler returns the HTTP method, route URL, and a typed Gin handler for the TargetPositionGetAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func TargetPositionGetActionHandler(
	handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := TargetPositionGetActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := TargetPositionGetActionRequest{
			Body:        nil,
			Params:      TargetPositionGetActionPathParameterFromGin(m),
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

// TargetPositionGetActionGin is a high-level convenience wrapper around TargetPositionGetActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func TargetPositionGetActionGin(r gin.IRoutes, handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error)) {
	method, url, h := TargetPositionGetActionHandler(handler)
	r.Handle(method, url, h)
}
func (x TargetPositionGetActionRequest) IsGin() bool {
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
func TargetPositionGetActionQueryFromGin(c *gin.Context) TargetPositionGetActionQuery {
	return TargetPositionGetActionQueryFromString(c.Request.URL.RawQuery)
}
func GetTargetPositionGetActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func TargetPositionGetActionPathParameterFromCli(c *cli.Command) TargetPositionGetActionPathParameter {
	return TargetPositionGetActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x TargetPositionGetActionRequest) IsCli() bool {
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

// TargetPositionGetActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the TargetPositionGetAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func TargetPositionGetActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetTargetPositionGetActionPathParameterCliFlags(""))...)
	return flags
}

// TargetPositionGetActionCliHandler builds a full *cli.Command for the
// TargetPositionGetAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a TargetPositionGetActionRequest the same way
// TargetPositionGetActionHandler (Gin) and TargetPositionGetActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func TargetPositionGetActionCliHandler(
	handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error),
) *cli.Command {
	meta := TargetPositionGetActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: TargetPositionGetActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := TargetPositionGetActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Params:      TargetPositionGetActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// TargetPositionGetActionCli is a high-level convenience wrapper around
// TargetPositionGetActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way TargetPositionGetActionGin
// registers a route on a Gin engine.
func TargetPositionGetActionCli(
	app *cli.Command,
	handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error),
) {
	app.Commands = append(app.Commands, TargetPositionGetActionCliHandler(handler))
}

// TargetPositionGetActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the TargetPositionGetAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *TargetPositionGetActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func TargetPositionGetActionHttpHandler(
	handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := TargetPositionGetActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := TargetPositionGetActionRequest{
			Body: nil,
			Params: TargetPositionGetActionPathParameterFromFn(func(key string) string {
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

// TargetPositionGetActionHttp is a high-level convenience wrapper around
// TargetPositionGetActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func TargetPositionGetActionHttp(
	mux *http.ServeMux,
	handler func(c TargetPositionGetActionRequest) (*TargetPositionGetActionResponse, error),
) {
	method, pattern, h := TargetPositionGetActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
