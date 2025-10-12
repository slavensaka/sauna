
// Jagged matrix holding our map
export type JaggedMatrix = string[][];

// Creats a 2D map with all the characters provided
// Can be expanded with any other type of data format to turn it into a 2D map (jagged)
export function dataFormatToJaggedMatrix(arrayMap: string[]): JaggedMatrix {
  const jaggedMatrix: JaggedMatrix = [];

  for (let y = 0; y < arrayMap.length; y++) {
    const row = arrayMap[y] ?? '';
    jaggedMatrix.push(row.split(''));
  }
  return jaggedMatrix;
}