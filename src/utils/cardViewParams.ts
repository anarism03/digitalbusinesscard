export type CardViewParams = {
  context: "company" | "admin";
  view: "team" | "card";
  employeeId?: string;
  editMode: boolean;
};

export function parseCardViewParams(params: URLSearchParams): CardViewParams {
  const context = params.get("context") === "company" ? "company" : "admin";
  return {
    context,
    view:
      context === "company" && params.get("view") === "team" ? "team" : "card",
    employeeId: params.get("employeeId") || undefined,
    editMode: params.get("edit") === "1",
  };
}
