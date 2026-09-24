export type Quote = {
  id: string;
  text: string;
  author: string;
  category: string;
};

export function categoryLabel(slug: string) {
  switch (slug) {
    case "history":
      return "Istorie";
    case "politics":
      return "Politică";
    case "economics":
      return "Economie";
    case "poetry":
      return "Poezie";
    case "literature":
      return "Literatură";
    case "philosophy":
      return "Filozofie";
    case "art":
      return "Artă";
    case "science":
      return "Știință";
    case "technology":
      return "Tehnologie";
    default:
      return slug;
  }
}
