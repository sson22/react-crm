function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.slice(1);
  }
  return function (a: any, b: any) {
    let a_value = "";
    let b_value = "";

    // isNaN is false if in num is a number, string or otherwise
    if (!isNaN(a) && !isNaN(b)) {
      a_value = a[property].toLowerCase();
      b_value = b[property].toLowerCase();
    } else {
      a_value = a[property];
      b_value = b[property];
    }

    const result = a_value < b_value ? -1 : a_value > b_value ? 1 : 0;
    return result * sortOrder;
  };
}

export { dynamicSort };
