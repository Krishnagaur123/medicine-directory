export interface FdaLabel {
  id?: string;
  purpose?: string[];
  warnings?: string[];
  warnings_and_cautions?: string[];
  boxed_warning?: string[];
  active_ingredient?: string[];
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    substance_name?: string[];
  };
}

export interface FdaApiResponse {
  results?: FdaLabel[];
  error?: {
    code: string;
    message: string;
  };
}

const FDA_API_BASE = "https://api.fda.gov/drug/label.json";

export async function fetchMedications(query: string): Promise<FdaApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    let res = await fetch(
      `${FDA_API_BASE}?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=20`,
      { signal: controller.signal }
    );

    if (res.status === 404) {
      res = await fetch(
        `${FDA_API_BASE}?search=openfda.generic_name:"${encodeURIComponent(query)}"&limit=20`,
        { signal: controller.signal }
      );
    }

    if (!res.ok) {
      if (res.status === 404) {
        return { results: [] };
      }
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error?.message || `API error: ${res.status}`);
    }

    const data: FdaApiResponse = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return { results: [] };
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
