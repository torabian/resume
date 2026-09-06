package resumedefs

import (
	"bytes"
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
* Action to communicate with the action LanguageUpdateAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of LanguageUpdateAction
func LanguageUpdateAction(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error) {
	return &LanguageUpdateActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func LanguageUpdateActionMeta() struct {
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
		Name:        "LanguageUpdateAction",
		CliName:     "update",
		CliShort:    "u",
		URL:         "/language/:uniqueId",
		Method:      "PATCH",
		Description: `Applies a partial update to a "language" row by uniqueId.`,
	}
}

type LanguageUpdateActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *LanguageUpdateActionResponse) SetContentType(contentType string) *LanguageUpdateActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *LanguageUpdateActionResponse) AsStream(r io.Reader, contentType string) *LanguageUpdateActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *LanguageUpdateActionResponse) AsJSON(payload any) *LanguageUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *LanguageUpdateActionResponse) WithIdeal(payload LanguageDto) *LanguageUpdateActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *LanguageUpdateActionResponse) AsIdeal() (*LanguageDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res LanguageDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *LanguageUpdateActionResponse) AsHTML(payload string) *LanguageUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *LanguageUpdateActionResponse) AsBytes(payload []byte) *LanguageUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x LanguageUpdateActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x LanguageUpdateActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x LanguageUpdateActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type LanguageUpdateActionRequestSig = func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error)

/**
 * Path parameters for LanguageUpdateAction
 */
type LanguageUpdateActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func LanguageUpdateActionPathParameterApply(params LanguageUpdateActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func LanguageUpdateActionPathParameterFromFn(fn func(key string) string) LanguageUpdateActionPathParameter {
	res := LanguageUpdateActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for LanguageUpdateAction
 */
// Query wrapper with private fields
type LanguageUpdateActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func LanguageUpdateActionQueryFromString(rawQuery string) LanguageUpdateActionQuery {
	v := LanguageUpdateActionQuery{}
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
func LanguageUpdateActionQueryFromHttp(r *http.Request) LanguageUpdateActionQuery {
	return LanguageUpdateActionQueryFromString(r.URL.RawQuery)
}
func (q LanguageUpdateActionQuery) Values() url.Values {
	return q.values
}
func (q LanguageUpdateActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *LanguageUpdateActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *LanguageUpdateActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type LanguageUpdateActionRequest struct {
	Body        LanguageOptionalDto
	Params      LanguageUpdateActionPathParameter
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
func (x LanguageUpdateActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x LanguageUpdateActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func LanguageUpdateActionClientCreateUrl(
	req LanguageUpdateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := LanguageUpdateActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = LanguageUpdateActionPathParameterApply(req.Params, urlAddr)
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
func LanguageUpdateActionClientExecuteTyped(httpReq *http.Request) (*LanguageUpdateActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result LanguageUpdateActionResponse
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
func LanguageUpdateActionClientBuildRequest(req LanguageUpdateActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := LanguageUpdateActionMeta()
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
func LanguageUpdateActionCall(
	req LanguageUpdateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*LanguageUpdateActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := LanguageUpdateActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := LanguageUpdateActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return LanguageUpdateActionClientExecuteTyped(r)
}
func LanguageUpdateActionPathParameterFromGin(g *gin.Context) LanguageUpdateActionPathParameter {
	return LanguageUpdateActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// LanguageUpdateActionRaw registers a raw Gin route for the LanguageUpdateAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func LanguageUpdateActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := LanguageUpdateActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// LanguageUpdateActionHandler returns the HTTP method, route URL, and a typed Gin handler for the LanguageUpdateAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func LanguageUpdateActionHandler(
	handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := LanguageUpdateActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body LanguageOptionalDto
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := LanguageUpdateActionRequest{
			Body:        body,
			Params:      LanguageUpdateActionPathParameterFromGin(m),
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

// LanguageUpdateActionGin is a high-level convenience wrapper around LanguageUpdateActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func LanguageUpdateActionGin(r gin.IRoutes, handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error)) {
	method, url, h := LanguageUpdateActionHandler(handler)
	r.Handle(method, url, h)
}
func (x LanguageUpdateActionRequest) IsGin() bool {
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
func LanguageUpdateActionQueryFromGin(c *gin.Context) LanguageUpdateActionQuery {
	return LanguageUpdateActionQueryFromString(c.Request.URL.RawQuery)
}
func GetLanguageUpdateActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func LanguageUpdateActionPathParameterFromCli(c *cli.Command) LanguageUpdateActionPathParameter {
	return LanguageUpdateActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x LanguageUpdateActionRequest) IsCli() bool {
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

// LanguageUpdateActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the LanguageUpdateAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func LanguageUpdateActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetLanguageOptionalDtoCliFlags(""))...)
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetLanguageUpdateActionPathParameterCliFlags(""))...)
	return flags
}

// LanguageUpdateActionCliHandler builds a full *cli.Command for the
// LanguageUpdateAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a LanguageUpdateActionRequest the same way
// LanguageUpdateActionHandler (Gin) and LanguageUpdateActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func LanguageUpdateActionCliHandler(
	handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error),
) *cli.Command {
	meta := LanguageUpdateActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: LanguageUpdateActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := LanguageUpdateActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastLanguageOptionalDtoFromCli(c),
			Params:      LanguageUpdateActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// LanguageUpdateActionCli is a high-level convenience wrapper around
// LanguageUpdateActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way LanguageUpdateActionGin
// registers a route on a Gin engine.
func LanguageUpdateActionCli(
	app *cli.Command,
	handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error),
) {
	app.Commands = append(app.Commands, LanguageUpdateActionCliHandler(handler))
}

// LanguageUpdateActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the LanguageUpdateAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *LanguageUpdateActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func LanguageUpdateActionHttpHandler(
	handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := LanguageUpdateActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body LanguageOptionalDto
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := LanguageUpdateActionRequest{
			Body: body,
			Params: LanguageUpdateActionPathParameterFromFn(func(key string) string {
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

// LanguageUpdateActionHttp is a high-level convenience wrapper around
// LanguageUpdateActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func LanguageUpdateActionHttp(
	mux *http.ServeMux,
	handler func(c LanguageUpdateActionRequest) (*LanguageUpdateActionResponse, error),
) {
	method, pattern, h := LanguageUpdateActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
