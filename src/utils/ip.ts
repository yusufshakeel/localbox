export function findIps(obj: any) {
  const results: string[] = [];

  function recursiveSearch(currentObj: any) {
    if (Array.isArray(currentObj)) {
      // If it's an array, search through each element
      currentObj.forEach(item => recursiveSearch(item));
    } else if (typeof currentObj === 'object' && currentObj !== null) {
      // Check if the object contains all the required fields
      if (currentObj['address']
          && currentObj['address'].startsWith('192.168.0.')
          && currentObj['family'] === 'IPv4') {
        results.push(currentObj['address']);
      }

      // Recurse into the nested objects
      for (const key in currentObj) {
        recursiveSearch(currentObj[key]);
      }
    }
  }

  recursiveSearch(obj);
  return results;
}