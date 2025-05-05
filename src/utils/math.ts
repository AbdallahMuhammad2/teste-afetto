/**
 * Mapeia um valor de um intervalo para outro
 * @param value Valor a ser mapeado
 * @param inputMin Valor mínimo do intervalo de entrada
 * @param inputMax Valor máximo do intervalo de entrada
 * @param outputMin Valor mínimo do intervalo de saída
 * @param outputMax Valor máximo do intervalo de saída
 * @returns Valor mapeado no intervalo de saída
 */
export const mapRange = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): number => {
  return (
    outputMin +
    ((outputMax - outputMin) * (value - inputMin)) / (inputMax - inputMin)
  );
};