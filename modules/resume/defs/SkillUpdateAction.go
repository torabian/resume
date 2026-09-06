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
* Action to communicate with the action SkillUpdateAction
 */
/*
Here is a quick function implementation to make your life easier:
// Actual implementation of SkillUpdateAction
func SkillUpdateAction(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error) {
	return &SkillUpdateActionResponse{
		// Payload is an interface. Use it at carefully.
	}, nil
}
*/
func SkillUpdateActionMeta() struct {
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
		Name:        "SkillUpdateAction",
		CliName:     "update",
		CliShort:    "u",
		URL:         "/skill/:uniqueId",
		Method:      "PATCH",
		Description: `Applies a partial update to a "skill" row by uniqueId.`,
	}
}

type SkillUpdateActionResponse struct {
	StatusCode int
	Headers    map[string]string
	Payload    interface{}
	// Do not manually fill this in. It has no effect. This is only useful when you are using
	// client code, and want to get access to the original response. When sending response from your
	// application it will be ignored.
	resp *http.Response
}

func (x *SkillUpdateActionResponse) SetContentType(contentType string) *SkillUpdateActionResponse {
	if x.Headers == nil {
		x.Headers = make(map[string]string)
	}
	x.Headers["Content-Type"] = contentType
	return x
}
func (x *SkillUpdateActionResponse) AsStream(r io.Reader, contentType string) *SkillUpdateActionResponse {
	x.Payload = r
	x.SetContentType(contentType)
	return x
}
func (x *SkillUpdateActionResponse) AsJSON(payload any) *SkillUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("application/json")
	return x
}

// When the response is expected as documentation, you call this to get some type
// safety for the action which is happening.
func (x *SkillUpdateActionResponse) WithIdeal(payload SkillDto) *SkillUpdateActionResponse {
	x.Payload = payload
	return x
}

// Use this for client calls, so the payload is being casted
func (x *SkillUpdateActionResponse) AsIdeal() (*SkillDto, error) {
	b, err := json.Marshal(x.GetPayload())
	if err != nil {
		return nil, err
	}
	var res SkillDto
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
func (x *SkillUpdateActionResponse) AsHTML(payload string) *SkillUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("text/html; charset=utf-8")
	return x
}
func (x *SkillUpdateActionResponse) AsBytes(payload []byte) *SkillUpdateActionResponse {
	x.Payload = payload
	x.SetContentType("application/octet-stream")
	return x
}
func (x SkillUpdateActionResponse) GetStatusCode() int {
	return x.StatusCode
}
func (x SkillUpdateActionResponse) GetRespHeaders() map[string]string {
	return x.Headers
}
func (x SkillUpdateActionResponse) GetPayload() interface{} {
	return x.Payload
}

// Request signature, which is here for refernece. Now it's inlined, so auto completions suggest the function body.
type SkillUpdateActionRequestSig = func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error)

/**
 * Path parameters for SkillUpdateAction
 */
type SkillUpdateActionPathParameter struct {
	UniqueId string
}

// Converts a placeholder url, and applies the parameters to it.
func SkillUpdateActionPathParameterApply(params SkillUpdateActionPathParameter, templateUrl string) string {
	templateUrl = strings.ReplaceAll(templateUrl, ":uniqueId", fmt.Sprintf("%v", params.UniqueId))
	return templateUrl
}

// General purpose to extract the value and cast based on type.
func SkillUpdateActionPathParameterFromFn(fn func(key string) string) SkillUpdateActionPathParameter {
	res := SkillUpdateActionPathParameter{}
	res.UniqueId = fn("uniqueId")
	return res
}

/**
 * Query parameters for SkillUpdateAction
 */
// Query wrapper with private fields
type SkillUpdateActionQuery struct {
	values url.Values
	mapped map[string]interface{}
	// Typesafe fields
}

func SkillUpdateActionQueryFromString(rawQuery string) SkillUpdateActionQuery {
	v := SkillUpdateActionQuery{}
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
func SkillUpdateActionQueryFromHttp(r *http.Request) SkillUpdateActionQuery {
	return SkillUpdateActionQueryFromString(r.URL.RawQuery)
}
func (q SkillUpdateActionQuery) Values() url.Values {
	return q.values
}
func (q SkillUpdateActionQuery) Mapped() map[string]interface{} {
	return q.mapped
}
func (q *SkillUpdateActionQuery) SetValues(v url.Values) {
	q.values = v
}
func (q *SkillUpdateActionQuery) SetMapped(m map[string]interface{}) {
	q.mapped = m
}

type SkillUpdateActionRequest struct {
	Body        SkillOptionalDto
	Params      SkillUpdateActionPathParameter
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
func (x SkillUpdateActionRequest) GetGinCtx() interface{} {
	return x.GinCtx
}

// Returns the urfave 3 cli context. You need to manullay cast to .(*cli.Command)
func (x SkillUpdateActionRequest) GetCliCtx() interface{} {
	return x.CliCtx
}
func SkillUpdateActionClientCreateUrl(
	req SkillUpdateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*url.URL, error) {
	meta := SkillUpdateActionMeta()
	urlAddr := meta.URL
	urlAddr = config.BaseURL + urlAddr
	// In case there is a path parameter, we need to apply that.
	urlAddr = SkillUpdateActionPathParameterApply(req.Params, urlAddr)
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
func SkillUpdateActionClientExecuteTyped(httpReq *http.Request) (*SkillUpdateActionResponse, error) {
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	// At this point, response is valid, and we need to return the results.
	var result SkillUpdateActionResponse
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
func SkillUpdateActionClientBuildRequest(req SkillUpdateActionRequest, reqUrl *url.URL, config *emigo.APIClient) (*http.Request, error) {
	meta := SkillUpdateActionMeta()
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
func SkillUpdateActionCall(
	req SkillUpdateActionRequest,
	config *emigo.APIClient, // optional pre-built request
) (*SkillUpdateActionResponse, error) {
	// This function intentionally is split into 3 different sections, so in case
	// of some modifications that we did not anticipate, at least a part would become quite useful.
	// first we create url, apply all path parameters, query params, etc
	u, err := SkillUpdateActionClientCreateUrl(req, config)
	if err != nil {
		return nil, err
	}
	// We create the request from the body in second stage
	r, err := SkillUpdateActionClientBuildRequest(req, u, config)
	if err != nil {
		return nil, err
	}
	// This one would execute the request and cast the result.
	return SkillUpdateActionClientExecuteTyped(r)
}
func SkillUpdateActionPathParameterFromGin(g *gin.Context) SkillUpdateActionPathParameter {
	return SkillUpdateActionPathParameterFromFn(func(key string) string {
		return g.Param(key)
	})
}

// SkillUpdateActionRaw registers a raw Gin route for the SkillUpdateAction action.
// This gives the developer full control over middleware, handlers, and response handling.
func SkillUpdateActionRaw(r *gin.Engine, handlers ...gin.HandlerFunc) {
	meta := SkillUpdateActionMeta()
	r.Handle(meta.Method, meta.URL, handlers...)
}

// SkillUpdateActionHandler returns the HTTP method, route URL, and a typed Gin handler for the SkillUpdateAction action.
// Developers implement their business logic as a function that receives a typed request object
// and returns either an *ActionResponse or nil. Body binding (JSON/YAML/XML/form), headers,
// errors, and the success response are all handled by emigo - see BindGinRequestBody,
// RenderGinError and RenderGinResult in github.com/torabian/emi/emigo.
func SkillUpdateActionHandler(
	handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error),
) (method, url string, h gin.HandlerFunc) {
	meta := SkillUpdateActionMeta()
	return meta.Method, meta.URL, func(m *gin.Context) {
		var body SkillOptionalDto
		if err := emigo.BindGinRequestBody(m, &body); err != nil {
			emigo.RenderGinError(m, err)
			return
		}
		// Build typed request wrapper
		req := SkillUpdateActionRequest{
			Body:        body,
			Params:      SkillUpdateActionPathParameterFromGin(m),
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

// SkillUpdateActionGin is a high-level convenience wrapper around SkillUpdateActionHandler.
// It automatically constructs and registers the typed route on the Gin engine.
// Use this when you don't need custom middleware or route grouping.
func SkillUpdateActionGin(r gin.IRoutes, handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error)) {
	method, url, h := SkillUpdateActionHandler(handler)
	r.Handle(method, url, h)
}
func (x SkillUpdateActionRequest) IsGin() bool {
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
func SkillUpdateActionQueryFromGin(c *gin.Context) SkillUpdateActionQuery {
	return SkillUpdateActionQueryFromString(c.Request.URL.RawQuery)
}
func GetSkillUpdateActionPathParameterCliFlags(prefix string) []emigo.CliFlag {
	return []emigo.CliFlag{
		{
			Name:     prefix + "pp-uniqueId",
			Type:     "string",
			Required: true,
		},
	}
}

// Extracts the path parameter from a urfave v3 cli.
func SkillUpdateActionPathParameterFromCli(c *cli.Command) SkillUpdateActionPathParameter {
	return SkillUpdateActionPathParameterFromFn(func(key string) string {
		// In cli, they are prefixed with pp, to avoid conflict with other params coming from 'in'
		// section of the definition.
		return c.String("pp-" + key)
	})
}
func (x SkillUpdateActionRequest) IsCli() bool {
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

// SkillUpdateActionCliFlags returns every flag (request body, path parameters,
// query parameters and typed headers) the SkillUpdateAction action can bind from
// urfave v3, plus a generic repeatable --header/-H flag for anything not covered by a
// typed header.
func SkillUpdateActionCliFlags() []cli.Flag {
	flags := []cli.Flag{
		&cli.StringSliceFlag{
			Name:    "header",
			Aliases: []string{"H"},
			Usage:   `Raw request header as "Key: Value", repeatable`,
		},
	}
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetSkillOptionalDtoCliFlags(""))...)
	flags = append(flags, emigo.CastEmiFlagToUrfave(GetSkillUpdateActionPathParameterCliFlags(""))...)
	return flags
}

// SkillUpdateActionCliHandler builds a full *cli.Command for the
// SkillUpdateAction action: it wires body, path parameters, query parameters and
// headers from urfave v3 CLI flags into a SkillUpdateActionRequest the same way
// SkillUpdateActionHandler (Gin) and SkillUpdateActionHttpHandler (net/http)
// do from their own transports, then prints the JSON response (or returns the error) so
// urfave reports the right exit code.
func SkillUpdateActionCliHandler(
	handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error),
) *cli.Command {
	meta := SkillUpdateActionMeta()
	cmd := &cli.Command{
		Name:  meta.CliName,
		Usage: meta.Description,
		Flags: SkillUpdateActionCliFlags(),
	}
	cmd.Aliases = []string{meta.CliShort}
	cmd.Action = func(ctx context.Context, c *cli.Command) error {
		req := SkillUpdateActionRequest{
			CliCtx:      c,
			QueryParams: url.Values{},
			Headers:     emigo.ParseCliHeaders(c.StringSlice("header")),
			Body:        CastSkillOptionalDtoFromCli(c),
			Params:      SkillUpdateActionPathParameterFromCli(c),
		}
		return emigo.HandleActionInCli(handler(req))
	}
	return cmd
}

// SkillUpdateActionCli is a high-level convenience wrapper around
// SkillUpdateActionCliHandler. It registers the generated command as a subcommand
// of an existing urfave v3 *cli.Command, the same way SkillUpdateActionGin
// registers a route on a Gin engine.
func SkillUpdateActionCli(
	app *cli.Command,
	handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error),
) {
	app.Commands = append(app.Commands, SkillUpdateActionCliHandler(handler))
}

// SkillUpdateActionHttpHandler returns the HTTP method, the ServeMux pattern, and a
// typed net/http handler for the SkillUpdateAction action. Developers implement
// their business logic as a function that receives a typed request object and
// returns either an *SkillUpdateActionResponse or nil. Body binding, headers, status
// codes, and errors are all handled by emigo - see BindHttpRequestBody, RenderHttpError
// and RenderHttpResult in github.com/torabian/emi/emigo.
func SkillUpdateActionHttpHandler(
	handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error),
) (method, pattern string, h http.HandlerFunc) {
	meta := SkillUpdateActionMeta()
	return meta.Method, meta.URL, func(w http.ResponseWriter, r *http.Request) {
		var body SkillOptionalDto
		if err := emigo.BindHttpRequestBody(r, &body); err != nil {
			emigo.RenderHttpError(w, r, err)
			return
		}
		// Build typed request wrapper. GinCtx stays nil here (this is not gin),
		// which is what the IsGin() helper keys off.
		req := SkillUpdateActionRequest{
			Body: body,
			Params: SkillUpdateActionPathParameterFromFn(func(key string) string {
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

// SkillUpdateActionHttp is a high-level convenience wrapper around
// SkillUpdateActionHttpHandler. It registers the typed route on a standard
// *http.ServeMux using Go 1.22+ method-aware pattern syntax (e.g. "POST /").
// Use this when you don't need custom middleware.
func SkillUpdateActionHttp(
	mux *http.ServeMux,
	handler func(c SkillUpdateActionRequest) (*SkillUpdateActionResponse, error),
) {
	method, pattern, h := SkillUpdateActionHttpHandler(handler)
	mux.HandleFunc(method+" "+pattern, h)
}
