// lib/handlebars.ts
import Handlebars from "handlebars";

const hbs = Handlebars.create();

hbs.registerHelper("stringify", (value) => {
  if (value == null) return "";

  return typeof value === "object"
    ? JSON.stringify(value, null, 2)
    : String(value);
});

export default hbs;