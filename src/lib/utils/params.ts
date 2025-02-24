export async function getDynamicParam(param: string | undefined): Promise<string> {
  if (!param) {
    throw new Error('Required parameter is missing');
  }
  return param;
} 