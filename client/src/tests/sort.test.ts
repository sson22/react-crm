import { dynamicSort } from "../util/dynamicSort";
const data = [{ name: "b" }, { name: "a" }, { name: "d" }, { name: "e" }, { name: "c" }];
const sorted = [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }, { name: "e" }];

const revsorted = [{ name: "e" }, { name: "d" }, { name: "c" }, { name: "b" }, { name: "a" }];

test("check that our sorting function works", () => {
  expect(data.sort(dynamicSort("name"))).toStrictEqual(sorted);
});

test("check that our sorting function works in reverse", () => {
  expect(data.sort(dynamicSort("-name"))).toStrictEqual(revsorted);
});
