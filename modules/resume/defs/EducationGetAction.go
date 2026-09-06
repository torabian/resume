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
* Action to communicate with the action EducationGetAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of EducationGetAction
func EducationGetAction(c EducationGetActionRequest) (*EducationGetActionResponse, error) {
	return &EducationGetActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func EducationGetActionMeta() struct {
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
		Name:        "EducationGetAction",
		CliName:     "get",
		CliShort:    "g",
		URL:         "/education/:uniqueId",
		Method:      "GET",
		Description: `Looks up a single "education" row by uniqueId.`,
	}
}

type EducationGetActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *EducationGetActionResponse) SetContentType(contentType string) *EducationGetActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *EducationGetActionResponse) AsStream(r io.Reader, contentType string) *EducationGetActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *EducationGetActionResponse) AsJSON(payload any) *EducationGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *EducationGetActionResponse) WithIdeal(payload EducationDto) *EducationGetActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *EducationGetActionResponse) AsIdeal() (*EducationDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res EducationDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *EducationGetActionResponse) AsHTML(payload string) *EducationGetActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *EducationGetActionResponse) AsBytes(payload []byte) *EducationGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x EducationGetActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x EducationGetActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x EducationGetActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type EducationGetActionRequestSig = func(c EducationGetActionRequest) (*EducationGetActionResponse, error)

/**
 * Path parameters for EducationGetAction
 */
type EducationGetActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func EducationGetActionPathParameterApply(params EducationGetActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func EducationGetActionPathParameterFromFn(fn func(key string) string) EducationGetActionPathParameter {
	res := EducationGetActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for EducationGetAction
 */
// Query wrapper with private fields
type EducationGetActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func EducationGetActionQueryFromString(rawQuery string) EducationGetActionQuery {
	v := EducationGetActionQuery{}
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
func EducationGetActionQueryFromHttp(r *http.Request) EducationGetActionQuery {
	return EducationGetActionQueryFromString(r.URL.RawQuery)
}
func (q EducationGetActionQuery) Values() url.Values {
	return q.values
}
func (q EducationGetActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *EducationGetActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *EducationGetActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type EducationGetActionRequest struct {
	Body        interface{}
	Params      EducationGetActionPathParameter
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
func (x EducationGetActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x EducationGetActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func EducationGetActionClientCreateUrl(
	req EducationGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := EducationGetActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = EducationGetActionPathParameterApply(req.Params, urlAddr)
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
func EducationGetActionClientExecuteTyped(httpReq *http.Request) (*EducationGetActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result EducationGetActionResponse
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
func EducationGetActionClientBuildRequest(req EducationGetActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := EducationGetActionMeta()
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
func EducationGetActionCall(
	req EducationGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*EducationGetActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := EducationGetActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := EducationGetActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return EducationGetActionClientExecuteTyped(r)
}
func EducationGetActionPathParameterFromGin(g *gin.Context) EducationGetActionPathParameter {
	return EducationGetActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// EducationGetActionRaw registers a raw Gin route for the EducationGetAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func EducationGetActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := EducationGetActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// EducationGetActionHandler returns the HTTP method, route URL, and a typed Gin handler for the EducationGetAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func EducationGetActionHandler(
	handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := EducationGetActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := EducationGetActionRequest{
			Body:        nil,
			Params:      EducationGetActionPathParameterFromGin(m),
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

// EducationGetActionGin is a high-level convenience wrapper around EducationGetActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func EducationGetActionGin(r gin.IRoutes, handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error)) {
	method, url, h := EducationGetActionHandler(handler)
	r.Handle(method, url, h)
}
func (x EducationGetActionRequest) IsGin() bool {
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
func EducationGetActionQueryFromGin(c *gin.Context) EducationGetActionQuery {
	return EducationGetActionQueryFromString(c.Request.URL.RawQuery)
}
func GetEducationGetActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func EducationGetActionPathParameterFromCli(c *cli.Command) EducationGetActionPathParameter {
	return EducationGetActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x EducationGetActionRequest) IsCli() bool {
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

// EducationGetActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the EducationGetAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func EducationGetActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetEducationGetActionPathParameterCliFlags(""))...)
	return flags
}

// EducationGetActionCliHandler builds a full *cli.Command for the
// EducationGetAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a EducationGetActionRequest the same way
// EducationGetActionHandler (Gin) and EducationGetActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func EducationGetActionCliHandler(
	handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error),
) *cli.Command {
	meta := EducationGetActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: EducationGetActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := EducationGetActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Params:      EducationGetActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// EducationGetActionCli is a high-level convenience wrapper around
// EducationGetActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way EducationGetActionGin
// registers a route on a Gin engine.
func EducationGetActionCli(
	app *cli.Command,
	handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error),
) {
	app.Commands = append(app.Commands, EducationGetActionCliHandler(handler))
}

// EducationGetActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the EducationGetAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *EducationGetActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func EducationGetActionHttpHandler(
	handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := EducationGetActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := EducationGetActionRequest{
			Body: nil,
			Params: EducationGetActionPathParameterFromFn(func(key string) string {
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

// EducationGetActionHttp is a high-level convenience wrapper around
// EducationGetActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func EducationGetActionHttp(
	mux *http.ServeMux,
	handler func(c EducationGetActionRequest) (*EducationGetActionResponse, error),
) {
	method, pattern, h := EducationGetActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
