import { assertArrayIncludes, assertEquals } from "../deps.ts";
import { NumberSchema } from "../../framework/validation/mod.ts";

const requiredMessage = {
  message: '"number" is required',
};
const notNumberMessage = {
  message: '"number" is not type "number"',
};
const isNotPositiveMessage = {
  message: '"number" is not positive',
};
const isNotNegativeMessage = {
  message: '"number" is not negative',
};
const isNotMinimumMessage = {
  message: '"number" is smaller than 10',
};
const isNotMaximumMessage = {
  message: '"number" is bigger than 10',
};

Deno.test("Number Schema Validation: 'isNumber'", () => {
  const isNumber = new NumberSchema();

  assertEquals(isNumber.validate(1).errors, []);
  assertEquals(isNumber.validate(0).errors, []);
  assertEquals(isNumber.validate(-1).errors, []);

  assertArrayIncludes(isNumber.validate(undefined).errors, [requiredMessage]);
  assertArrayIncludes(isNumber.validate(null).errors, [requiredMessage]);

  assertArrayIncludes(isNumber.validate("").errors, [notNumberMessage]);

  assertArrayIncludes(isNumber.validate({}).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate([]).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate(() => {}).errors, [notNumberMessage]);

  assertArrayIncludes(isNumber.validate(NaN).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate(Infinity).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate(-Infinity).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate(NaN).errors, [notNumberMessage]);

  assertArrayIncludes(isNumber.validate(true).errors, [notNumberMessage]);
  assertArrayIncludes(isNumber.validate(false).errors, [notNumberMessage]);
});

Deno.test("Number Schema Validation: 'required'", () => {
  const required = new NumberSchema().optional().required();

  assertEquals(required.validate(1).errors, []);
  assertEquals(required.validate(0).errors, []);
  assertEquals(required.validate(-1).errors, []);

  assertArrayIncludes(required.validate(undefined).errors, [requiredMessage]);
  assertArrayIncludes(required.validate(null).errors, [requiredMessage]);

  assertArrayIncludes(required.validate("").errors, [notNumberMessage]);

  assertArrayIncludes(required.validate({}).errors, [notNumberMessage]);
  assertArrayIncludes(required.validate([]).errors, [notNumberMessage]);
  assertArrayIncludes(required.validate(() => {}).errors, [notNumberMessage]);

  assertArrayIncludes(required.validate(NaN).errors, [notNumberMessage]);

  assertArrayIncludes(required.validate(true).errors, [notNumberMessage]);
  assertArrayIncludes(required.validate(false).errors, [notNumberMessage]);
});

Deno.test("Number Schema Validation: 'optional'", () => {
  const optional = new NumberSchema().optional();

  assertEquals(optional.validate(1).errors, []);
  assertEquals(optional.validate(0).errors, []);
  assertEquals(optional.validate(-1).errors, []);

  assertEquals(optional.validate(undefined).errors, []);
  assertEquals(optional.validate(null).errors, []);

  assertArrayIncludes(optional.validate("").errors, [notNumberMessage]);

  assertArrayIncludes(optional.validate({}).errors, [notNumberMessage]);
  assertArrayIncludes(optional.validate([]).errors, [notNumberMessage]);
  assertArrayIncludes(optional.validate(() => {}).errors, [notNumberMessage]);

  assertArrayIncludes(optional.validate(NaN).errors, [notNumberMessage]);

  assertArrayIncludes(optional.validate(true).errors, [notNumberMessage]);
  assertArrayIncludes(optional.validate(false).errors, [notNumberMessage]);
});

Deno.test("Number Schema Validation: 'positive'", () => {
  const positive = new NumberSchema().positive();

  assertEquals(positive.validate(1).errors, []);
  assertArrayIncludes(positive.validate(0).errors, [isNotPositiveMessage]);
  assertArrayIncludes(positive.validate(-1).errors, [isNotPositiveMessage]);

  assertArrayIncludes(positive.validate(undefined).errors, [
    isNotPositiveMessage,
  ]);
  assertArrayIncludes(positive.validate(null).errors, [isNotPositiveMessage]);

  assertArrayIncludes(positive.validate("").errors, [isNotPositiveMessage]);

  assertArrayIncludes(positive.validate({}).errors, [isNotPositiveMessage]);
  assertArrayIncludes(positive.validate([]).errors, [isNotPositiveMessage]);
  assertArrayIncludes(positive.validate(() => {}).errors, [
    isNotPositiveMessage,
  ]);

  assertArrayIncludes(positive.validate(NaN).errors, [isNotPositiveMessage]);

  assertArrayIncludes(positive.validate(true).errors, [isNotPositiveMessage]);
  assertArrayIncludes(positive.validate(false).errors, [isNotPositiveMessage]);
});

Deno.test("Number Schema Validation: 'negative'", () => {
  const negative = new NumberSchema().negative();

  assertEquals(negative.validate(-1).errors, []);
  assertArrayIncludes(negative.validate(0).errors, [isNotNegativeMessage]);
  assertArrayIncludes(negative.validate(1).errors, [isNotNegativeMessage]);

  assertArrayIncludes(negative.validate(undefined).errors, [
    isNotNegativeMessage,
  ]);
  assertArrayIncludes(negative.validate(null).errors, [isNotNegativeMessage]);

  assertArrayIncludes(negative.validate("").errors, [isNotNegativeMessage]);

  assertArrayIncludes(negative.validate({}).errors, [isNotNegativeMessage]);
  assertArrayIncludes(negative.validate([]).errors, [isNotNegativeMessage]);
  assertArrayIncludes(negative.validate(() => {}).errors, [
    isNotNegativeMessage,
  ]);

  assertArrayIncludes(negative.validate(NaN).errors, [isNotNegativeMessage]);

  assertArrayIncludes(negative.validate(true).errors, [isNotNegativeMessage]);
  assertArrayIncludes(negative.validate(false).errors, [isNotNegativeMessage]);
});

Deno.test("Number Schema Validation: 'min'", () => {
  const min = new NumberSchema().min(10);

  assertEquals(min.validate(11).errors, []);
  assertEquals(min.validate(10).errors, []);
  assertArrayIncludes(min.validate(9).errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate(0).errors, [isNotMinimumMessage]);
  assertArrayIncludes(min.validate(1).errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate(undefined).errors, [isNotMinimumMessage]);
  assertArrayIncludes(min.validate(null).errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate("").errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate({}).errors, [isNotMinimumMessage]);
  assertArrayIncludes(min.validate([]).errors, [isNotMinimumMessage]);
  assertArrayIncludes(min.validate(() => {}).errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate(NaN).errors, [isNotMinimumMessage]);

  assertArrayIncludes(min.validate(true).errors, [isNotMinimumMessage]);
  assertArrayIncludes(min.validate(false).errors, [isNotMinimumMessage]);
});

Deno.test("Number Schema Validation: 'max'", () => {
  const max = new NumberSchema().max(10);

  assertEquals(max.validate(9).errors, []);
  assertEquals(max.validate(10).errors, []);
  assertArrayIncludes(max.validate(11).errors, [isNotMaximumMessage]);

  assertEquals(max.validate(-1).errors, []);
  assertEquals(max.validate(0).errors, []);
  assertEquals(max.validate(1).errors, []);

  assertArrayIncludes(max.validate(undefined).errors, [isNotMaximumMessage]);
  assertArrayIncludes(max.validate(null).errors, [isNotMaximumMessage]);

  assertArrayIncludes(max.validate("").errors, [isNotMaximumMessage]);

  assertArrayIncludes(max.validate({}).errors, [isNotMaximumMessage]);
  assertArrayIncludes(max.validate([]).errors, [isNotMaximumMessage]);
  assertArrayIncludes(max.validate(() => {}).errors, [isNotMaximumMessage]);

  assertArrayIncludes(max.validate(NaN).errors, [isNotMaximumMessage]);

  assertArrayIncludes(max.validate(true).errors, [isNotMaximumMessage]);
  assertArrayIncludes(max.validate(false).errors, [isNotMaximumMessage]);
});
