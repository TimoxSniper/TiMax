/**
 * Pagination Utilities
 *
 * Provides validated pagination parameter parsing for API routes.
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Parse and validate pagination parameters from URL search params
 *
 * @param searchParams - URLSearchParams from request
 * @param defaultLimit - Default limit (default: 20)
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @returns Validated pagination params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit: number = 20,
  maxLimit: number = 100
): PaginationParams {
  // Parse page
  let page = parseInt(searchParams.get("page") || "1", 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse limit with bounds
  let limit = parseInt(searchParams.get("limit") || String(defaultLimit), 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build pagination response object
 *
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total item count
 * @returns Pagination metadata for API response
 */
export function buildPaginationResponse(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}
