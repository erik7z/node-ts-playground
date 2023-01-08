import Handlebars from "handlebars"

/**
 * # Expressions
 * # Simple expressions:
 * Handlebars expressions are some contents enclosed by double curly braces {{}}
 */
// const source = "<p>{{firstname}} {{lastname}}</p>"
// const template = Handlebars.compile(source)
//
// const data = {
//   firstname: "Yehuda",
//   lastname: "Katz",
// }
// const result = template(data);
//
// console.log(result)


/**
 * # Nested input objects (Path expressions):
 * Handlebars expressions can also be dot-separated paths.
 */

// const source = "<p>{{person.firstname}} {{person.lastname}}</p>"
// const template = Handlebars.compile(source)
//
// const data = {
//   person: {
//     firstname: "Yehuda",
//     lastname: "Katz",
//   },
// }
//
// const result = template(data);
//
// console.log(result)

/**
 * Handlebars also supports a deprecated / syntax, so you could write the above template as:
 * ```{{person/firstname}} {{person/lastname}}```
 */


/**
 * # Changing the context
 * Some helpers like #with and #each allow you to dive into nested objects.
 * When you include ../ segments in your path, Handlebars will change back into the parent context.
 */

// const source = `
// {{#each people}}
//     {{../prefix}} {{firstname}}
// {{/each}}
// `
// const template = Handlebars.compile(source)
//
// const data = {
//   people: [
//     { firstname: "Nils" },
//     { firstname: "Yehuda" },
//   ],
//   prefix: "Hello",
// }
//
// const result = template(data);
// console.log(result)


/**
 * # Literal segments (literal access to data items)
 * Identifiers may be any unicode character except for the following:
 * ```Whitespace ! " # % & ' ( ) * + , . / ; < = > @ [ \ ] ^ ` { | } ~```
 * In addition, the words `true`, `false`, null and `undefined` are only allowed in the first part of a path expression.
 */

// const source = `
// {{!-- wrong: {{array.0.item}} --}}
// correct: array.[0].item: {{array.[0].item}}
//
// {{!-- wrong: {{array.[0].item-class}} --}}
// correct: array.[0].[item-class]: {{array.[0].[item-class]}}
//
// {{!-- wrong: {{./true}}--}}
// correct: ./[true]: {{./[true]}}
// `
// const template = Handlebars.compile(source)
//
// const data = {
//   array: [
//     {
//       item: "item1",
//       "item-class": "class1",
//     },
//   ],
//   true: "yes",
// }
//
// const result = template(data);
// console.log(result)

/**
 * # HTML-escaping
 * In Handlebars, the values returned by the {{expression}} are HTML-escaped.
 * Say, if the expression contains &, then the returned HTML-escaped output is generated as `&amp;`.
 * If you don't want Handlebars to escape a value, use the "triple-stash", `{{{`:
 */

// const source = `
// raw: {{{specialChars}}}
// html-escaped: {{specialChars}}
// `
// const template = Handlebars.compile(source)
//
// const data = { specialChars: "& < > \" ' ` =" }
//
// const result = template(data);
// console.log(result)

/**
 * # Helpers
 * Helpers can be used to implement functionality that is not part of the Handlebars language itself.
 *
 * A helper can be registered at runtime via Handlebars.registerHelper, for example in order to uppercase all characters of a string.
 *
 * A Handlebars helper call is a simple identifier, followed by zero or more parameters (separated by a space).
 */

// const source = `
// {{firstname}} {{loud lastname}}
// `
//
// /**
//  * In this case, loud is the name of a helper, and lastname is a parameter to the helper.
//  * The template will uppercase the lastname property of the input
//  */
//
// Handlebars.registerHelper('loud', function (aString) {
//   return aString.toUpperCase()
// })
//
// const template = Handlebars.compile(source)
//
// const data = {
//   firstname: "Yehuda",
//   lastname: "Katz",
// }
//
// const result = template(data);
// console.log(result)

/**
 * ## Prevent HTML-escaping of helper return values
 *
 * When your helper returns an instance of Handlebars.Safestring the return-value is not escaped,
 * even if the helper is called with `{{` instead of `{{{`.
 *
 * You have to take care that all parameters are escaped properly using `Handlebars.escapeExpression`.
 */


// const source = `
// {{bold text}}
// `
//
// Handlebars.registerHelper("bold", function(text) {
//   var result = "<b>" + Handlebars.escapeExpression(text) + "</b>";
//   return new Handlebars.SafeString(result);
// });
//
// const template = Handlebars.compile(source)
//
// const data = { text: "Isn't this great?" }
//
// const result = template(data);
// console.log(result)


/**
 * ## Helpers with Multiple Parameters
 */

// const source = `
// {{link "See Website" url}}
// `
//
// Handlebars.registerHelper("link", function(text: string, url: string) {
//     url = Handlebars.escapeExpression(url),
//     text = Handlebars.escapeExpression(text)
//
//   return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
// });
//
// const template = Handlebars.compile(source)
//
// const data = { url: "https://yehudakatz.com/" }
//
// const result = template(data);
// console.log(result)


/**
 * In the above example, You could use the exact same helper with dynamic text based on the value of people.text:
 */

// const source = `
// {{link people.text people.url}}
// `
//
// Handlebars.registerHelper("link", function(text: string, url: string) {
//     url = Handlebars.escapeExpression(url),
//     text = Handlebars.escapeExpression(text)
//
//   return new Handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
// });
//
// const template = Handlebars.compile(source)
//
// const data = {
//   people: {
//     firstname: "Yehuda",
//     lastname: "Katz",
//     url: "https://yehudakatz.com/",
//     text: "See Website",
//   },
// }
//
// const result = template(data);
// console.log(result)


/**
 * ## Helpers with Hash arguments
 * Handlebars provides additional metadata, such as `hash`, `data`, `loc`, `name`  arguments, to helpers as a final parameter.
 */

//
// const source = `
// {{link "See Website" href=person.url class="person" alt=person.lastname}}
// `
//
// Handlebars.registerHelper("link", function(text: string, metadata: any) {
//   const attributes: string[] = [];
//
//   Object.keys(metadata.hash).forEach(key => {
//     const escapedKey = Handlebars.escapeExpression(key);
//     const escapedValue = Handlebars.escapeExpression(metadata.hash[key]);
//     attributes.push(escapedKey + '="' + escapedValue + '"');
//   })
//   const escapedText = Handlebars.escapeExpression(text);
//
//   const escapedOutput ="<a " + attributes.join(" ") + ">" + escapedText + "</a>";
//   return new Handlebars.SafeString(escapedOutput);
// });
//
//
// const template = Handlebars.compile(source)
//
// const data = {
//   person: {
//     firstname: "Yehuda",
//     lastname: "Katz",
//     url: "https://yehudakatz.com/",
//   },
// }
//
// const result = template(data);
// console.log(result)


/**
 * ## Disambiguating helpers calls and property lookup
 * If a helper is registered by the same name as a property of an input object, the helper has priority over the input property.
 * If you want to resolve the input property instead, you can prefix its name with ./ or this. (or the deprecated this/)
 */

// const source = `
// helper: {{name}}
// data: {{./name}} or {{this/name}} or {{this.name}}
// `
//
// Handlebars.registerHelper('name', function () {
//   return "Nils"
// })
//
// const template = Handlebars.compile(source)
//
// const data = { name: "Yehuda" }
//
// const result = template(data);
// console.log(result)


/**
 * # Subexpressions
 * Handlebars offers support for subexpressions, which allows you to invoke multiple helpers within a single mustache,
 * and pass in the results of inner helper invocations as arguments to outer helpers.
 *
 * Subexpressions are delimited by parentheses.
 * ```{{outer-helper (inner-helper 'abc') 'def'}}```
 *
 * In this case, inner-helper will get invoked with the string argument 'abc',
 * and whatever the inner-helper function returns will get passed in as the first argument to outer-helper (and 'def' will get passed in as the second argument to outer-helper).
 */


/**
 * # Whitespace Control
 * Template whitespace may be omitted from either side of any mustache statement by adding a ~ character by the braces.
 * When applied all whitespace on that side will be removed up to the first handlebars expression or non-whitespace character on that side.
 */

// const template = Handlebars.compile(`
// {{#each nav ~}}
//   <a href="{{url}}">
//     {{~#if test}}
//       {{~title}}
//     {{~^~}}
//       Empty
//     {{~/if~}}
//   </a>
// {{~/each}}
// `)
// const result = template({
//   nav: [{ url: "foo", test: true, title: "bar" }, { url: "bar" }]
// });
//
// console.log(result)

/**
 * # Escaping Handlebars expressions
 * Handlebars content may be escaped in one of two ways, inline escapes or raw block helpers.
 * Inline escapes created by prefixing a mustache block with \.
 * Raw blocks are created using {{{{ mustache braces.
 */

const template = Handlebars.compile(`
{{#each nav ~}}
  <a href="{{url}}">
    {{~#if test}}
      {{~title}}
    {{~^~}}
      Empty
    {{~/if~}}
  </a>
{{~/each}}
`)
const result = template({
  nav: [{ url: "foo", test: true, title: "bar" }, { url: "bar" }]
});

console.log(result)
