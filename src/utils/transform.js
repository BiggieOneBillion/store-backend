function parseNestedObject(obj) {
  const result = {};

  for (const key in obj) {
    const value = obj[key];

    // Convert string numbers to actual numbers when applicable
    const parsedValue =
      !isNaN(value) && value.trim() !== "" && value !== null
        ? Number(value)
        : value;

    // Match keys with bracket notation (e.g., inventory[quantity], variants[0][name])
    const path = key
      .replace(/\[/g, ".") // Replace [ with .
      .replace(/\]/g, "") // Remove ]
      .split("."); // Split into parts

    let current = result;
    for (let i = 0; i < path.length; i++) {
      const part = path[i];

      if (i === path.length - 1) {
        // Set value at the final property
        current[part] = parsedValue;
      } else {
        // Determine if the next key is an array index
        const nextPart = path[i + 1];
        if (!current[part]) {
          current[part] = isNaN(Number(nextPart)) ? {} : [];
        }
        current = current[part];
      }
    }
  }

  return result;
}

module.exports = {
  parseNestedObject,
};
