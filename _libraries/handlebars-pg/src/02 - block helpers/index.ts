import Handlebars from "handlebars"

/**
 * # Partials:
 * Handlebars allows for template reuse through partials. Partials are normal Handlebars templates that may be called directly by other templates.
 */

// const source = "{{> myPartial }}"
// Handlebars.registerPartial('myPartial', '{{prefix}}');
//
// const template = Handlebars.compile(source)
//
// const data = { prefix: "Hello" }
// const result = template(data);
//
// console.log(result)

/**
 * # Dynamic Partials:
 * It's possible to dynamically select the partial to be executed by using sub expression syntax.
 */

// const source = "{{> (whichPartial) }}"
//
// Handlebars.registerPartial('dynamicPartial', 'Dynamo!');
// Handlebars.registerHelper('whichPartial', function(context, options) { return 'dynamicPartial' });
//
// const template = Handlebars.compile(source)
//
// const data = null
// const result = template(data);
//
// console.log(result)

/**
 * Subexpressions do not resolve variables so whichPartial must be a function.
 * If a simple variable has the partial name, it's possible to resolve it via the lookup helper.
 */

// const source = "{{> (lookup . 'myVariable') }}"
//
// Handlebars.registerPartial('lookupMyPartial', 'Found!');
//
// const template = Handlebars.compile(source)
//
// const data = { myVariable: "lookupMyPartial" }
// const result = template(data);
//
// console.log(result)

/**
 * # Dynamic Partials:
 * It's possible to execute partials on a custom context by passing in the context to the partial call.
 */

// const source = "{{> myPartial myOtherContext }}"
//
// Handlebars.registerPartial('myPartial', '{{information}}!');
//
// const template = Handlebars.compile(source)
//
// const data = {
//   myOtherContext: {
//     information: "Interesting!",
//   },
// }
//
// const result = template(data);
//
// console.log(result)


/**
 * # Partial Parameters
 * Custom data can be passed to partials through hash parameters.
 */

// const source = "{{> myPartial parameter=favoriteNumber }}"
//
// Handlebars.registerPartial('myPartial', 'The result is {{parameter}}');
//
// const template = Handlebars.compile(source)
//
// const data = { favoriteNumber: 123 }
//
// const result = template(data);
//
// console.log(result)


/**
 * # Partial Blocks
 * The normal behavior when attempting to render a partial that is not found is for the implementation to throw an error.
 * If failover is desired instead, partials may be called using the block syntax.
 */

// const source = `
// {{#> myPartial }}
//   Failover content
// {{/myPartial}}
// `
// const template = Handlebars.compile(source)
//
// const data = null
// const result = template(data);
//
// console.log(result)


/**
 * This block syntax may also be used to pass templates to the partial,
 * which can be executed by the specially named partial, @partial-block
 */

// const source = `
// {{#> layout }}
// "BLOCK Fail Content"
// {{/layout}}
// `
// Handlebars.registerPartial('layout', 'Site Content {{> @partial-block }}');
//
// const template = Handlebars.compile(source)
//
// const data = null
// const result = template(data);
//
// console.log(result)

/**
 * When called in this manner, the block will execute under the context of the partial at the time of the call.
 * Depthed paths and block parameters operate relative to the partial block rather than the partial template.
 */

// const source = `
// {{#each people as |person|}}
//   {{#> childEntry}}
//     {{person.firstname}}
//   {{/childEntry}}
// {{/each}}
// `
//
// const template = Handlebars.compile(source)
//
// const data = {
//   people: [
//     { firstname: "Nils" },
//     { firstname: "Yehuda" },
//     { firstname: "Carl" },
//   ],
// }
// const result = template(data);
//
// // Will render person.firstname from this template, not the partial.
// console.log(result)


// /**
//  * # Inline Partials
//  * Templates may define block scoped partials via the `inline` decorator.
//  */
//
// const source = `
// {{#*inline "myPartial"}}
//   The name is: {{name}}
// {{/inline}}
//
// {{#each people}}
//   {{> myPartial name=firstname}}
// {{/each}}
// `
// const template = Handlebars.compile(source)
//
// const data = {
//   people: [
//     { firstname: "Nils" },
//     { firstname: "Yehuda" },
//   ],
// }
//
// const result = template(data);
//
// console.log(result)


/**
 * Each inline partial is available to the current block and all children, including execution of other partials.
 */

const source = `
{{#> layout}}

  {{#*inline "nav"}}
    My Nav
  {{/inline}}
  
  {{#*inline "content"}}
    My Content
  {{/inline}}
  
{{/layout}}
`

Handlebars.registerPartial('layout', `
<div class="nav">
  {{> nav}}
</div>
<div class="content">
  {{> content}}
</div>
`);

const template = Handlebars.compile(source)

const data = null

const result = template(data);

console.log(result)
