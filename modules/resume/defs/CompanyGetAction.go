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
* Action to communicate with the action CompanyGetAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of CompanyGetAction
func CompanyGetAction(c CompanyGetActionRequest) (*CompanyGetActionResponse, error) {
	return &CompanyGetActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func CompanyGetActionMeta() struct {
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
		Name:        "CompanyGetAction",
		CliName:     "get",
		CliShort:    "g",
		URL:         "/company/:uniqueId",
		Method:      "GET",
		Description: `Looks up a single "company" row by uniqueId.`,
	}
}

type CompanyGetActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *CompanyGetActionResponse) SetContentType(contentType string) *CompanyGetActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *CompanyGetActionResponse) AsStream(r io.Reader, contentType string) *CompanyGetActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *CompanyGetActionResponse) AsJSON(payload any) *CompanyGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *CompanyGetActionResponse) WithIdeal(payload CompanyDto) *CompanyGetActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *CompanyGetActionResponse) AsIdeal() (*CompanyDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res CompanyDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *CompanyGetActionResponse) AsHTML(payload string) *CompanyGetActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *CompanyGetActionResponse) AsBytes(payload []byte) *CompanyGetActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x CompanyGetActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x CompanyGetActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x CompanyGetActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type CompanyGetActionRequestSig = func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error)

/**
 * Path parameters for CompanyGetAction
 */
type CompanyGetActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func CompanyGetActionPathParameterApply(params CompanyGetActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func CompanyGetActionPathParameterFromFn(fn func(key string) string) CompanyGetActionPathParameter {
	res := CompanyGetActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for CompanyGetAction
 */
// Query wrapper with private fields
type CompanyGetActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func CompanyGetActionQueryFromString(rawQuery string) CompanyGetActionQuery {
	v := CompanyGetActionQuery{}
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
func CompanyGetActionQueryFromHttp(r *http.Request) CompanyGetActionQuery {
	return CompanyGetActionQueryFromString(r.URL.RawQuery)
}
func (q CompanyGetActionQuery) Values() url.Values {
	return q.values
}
func (q CompanyGetActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *CompanyGetActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *CompanyGetActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type CompanyGetActionRequest struct {
	Body        interface{}
	Params      CompanyGetActionPathParameter
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
func (x CompanyGetActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x CompanyGetActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func CompanyGetActionClientCreateUrl(
	req CompanyGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := CompanyGetActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = CompanyGetActionPathParameterApply(req.Params, urlAddr)
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
func CompanyGetActionClientExecuteTyped(httpReq *http.Request) (*CompanyGetActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result CompanyGetActionResponse
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
func CompanyGetActionClientBuildRequest(req CompanyGetActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := CompanyGetActionMeta()
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
func CompanyGetActionCall(
	req CompanyGetActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*CompanyGetActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := CompanyGetActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := CompanyGetActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return CompanyGetActionClientExecuteTyped(r)
}
func CompanyGetActionPathParameterFromGin(g *gin.Context) CompanyGetActionPathParameter {
	return CompanyGetActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// CompanyGetActionRaw registers a raw Gin route for the CompanyGetAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func CompanyGetActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := CompanyGetActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// CompanyGetActionHandler returns the HTTP method, route URL, and a typed Gin handler for the CompanyGetAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func CompanyGetActionHandler(
	handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := CompanyGetActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		// Build typed request wrapper
		req := CompanyGetActionRequest{
			Body:        nil,
			Params:      CompanyGetActionPathParameterFromGin(m),
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

// CompanyGetActionGin is a high-level convenience wrapper around CompanyGetActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func CompanyGetActionGin(r gin.IRoutes, handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error)) {
	method, url, h := CompanyGetActionHandler(handler)
	r.Handle(method, url, h)
}
func (x CompanyGetActionRequest) IsGin() bool {
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
func CompanyGetActionQueryFromGin(c *gin.Context) CompanyGetActionQuery {
	return CompanyGetActionQueryFromString(c.Request.URL.RawQuery)
}
func GetCompanyGetActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func CompanyGetActionPathParameterFromCli(c *cli.Command) CompanyGetActionPathParameter {
	return CompanyGetActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x CompanyGetActionRequest) IsCli() bool {
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

// CompanyGetActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the CompanyGetAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func CompanyGetActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetCompanyGetActionPathParameterCliFlags(""))...)
	return flags
}

// CompanyGetActionCliHandler builds a full *cli.Command for the
// CompanyGetAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a CompanyGetActionRequest the same way
// CompanyGetActionHandler (Gin) and CompanyGetActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func CompanyGetActionCliHandler(
	handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error),
) *cli.Command {
	meta := CompanyGetActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: CompanyGetActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := CompanyGetActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Params:      CompanyGetActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// CompanyGetActionCli is a high-level convenience wrapper around
// CompanyGetActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way CompanyGetActionGin
// registers a route on a Gin engine.
func CompanyGetActionCli(
	app *cli.Command,
	handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error),
) {
	app.Commands = append(app.Commands, CompanyGetActionCliHandler(handler))
}

// CompanyGetActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the CompanyGetAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *CompanyGetActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func CompanyGetActionHttpHandler(
	handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := CompanyGetActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := CompanyGetActionRequest{
			Body: nil,
			Params: CompanyGetActionPathParameterFromFn(func(key string) string {
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

// CompanyGetActionHttp is a high-level convenience wrapper around
// CompanyGetActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func CompanyGetActionHttp(
	mux *http.ServeMux,
	handler func(c CompanyGetActionRequest) (*CompanyGetActionResponse, error),
) {
	method, pattern, h := CompanyGetActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
