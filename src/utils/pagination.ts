import type { PageResult } from "../types";

export async function fetchAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<PageResult<T>>,
  pageSize = 1000,
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; ; page += 1) {
    const result = await fetchPage(page, pageSize);
    items.push(...result.items);
    if (result.items.length === 0 || items.length >= result.totalCount) {
      return items;
    }
  }
}
